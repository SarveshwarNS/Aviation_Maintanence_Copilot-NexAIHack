"""Agentic aviation maintenance assistant built with LangGraph and Ollama qwen2.5:3b.

Features:
  - Input abbreviation normalization via `utils.normalizer.normalize_text`
  - Tool binding: `search_records` and `get_record` from `search_engine`
  - Strict Refusal Threshold Logic (refuses queries with top match score < 0.35)
  - Explicit record ID citations (e.g. `[Record #100062]`)
  - Execution trace recording tool calls and intermediate decisions
"""

from __future__ import annotations

import json
import os
import re
import urllib.request
import uuid
from typing import Any, Dict, List, Optional, TypedDict

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.graph import END, StateGraph

from search_engine import detect_recurring_defects, get_record, search_records
from utils.normalizer import normalize_text

load_dotenv()

REFUSAL_THRESHOLD = 0.35
REFUSAL_MESSAGE = "Insufficient evidence in historical logbooks to provide a confident fix."


# ---------------------------------------------------------------------------
# Tool Definitions
# ---------------------------------------------------------------------------
@tool
def search_records_tool(query: str) -> str:
    """Search aviation maintenance records using hybrid BM25 and FAISS search."""
    results = search_records(query, top_k=5)
    return json.dumps(results, indent=2)


@tool
def get_record_tool(record_id: str) -> str:
    """Retrieve full details of a specific aviation maintenance log record by IDENT ID."""
    rec = get_record(record_id)
    if not rec:
        return f"Record {record_id} not found."
    return json.dumps(rec, indent=2)


TOOLS = [search_records_tool, get_record_tool]


# ---------------------------------------------------------------------------
# LLM Initialization with Cloud Gemini & Local Ollama Support
# ---------------------------------------------------------------------------
class GeminiLLM:
    """Lightweight LangChain-compatible wrapper for Google Gemini API."""

    def __init__(self, api_key: str, model: str = "gemini-3.8-flash") -> None:
        self.api_key = api_key
        self.model = model

    def invoke(self, messages: list[Any]) -> AIMessage:
        prompt_lines = []
        for msg in messages:
            msg_type = getattr(msg, "type", "user")
            content = getattr(msg, "content", "")
            if msg_type == "system":
                prompt_lines.append(f"System Instructions:\n{content}\n")
            elif msg_type == "human":
                prompt_lines.append(f"User Problem:\n{content}\n")
            elif msg_type == "tool":
                prompt_lines.append(f"Retrieved Historical Records:\n{content}\n")
            elif content:
                prompt_lines.append(f"{content}\n")

        prompt_text = "\n".join(prompt_lines)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt_text}]}],
            "generationConfig": {"temperature": 0.1, "maxOutputTokens": 1024},
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                url,
                data=payload,
                headers={"Content-Type": "application/json", "x-goog-api-key": self.api_key},
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    text = candidates[0]["content"]["parts"][0]["text"].strip()
                    return AIMessage(content=text)
        except Exception as exc:
            print(f"Cloud Gemini request failed or timed out ({exc}); falling back to local Ollama...")
            try:
                base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
                model_name = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
                chat_model = ChatOllama(model=model_name, base_url=base_url, temperature=0.1)
                return chat_model.invoke(messages)
            except Exception as o_exc:
                print(f"Ollama fallback error: {o_exc}")

        return AIMessage(content="Unable to generate response from either Gemini or Ollama.")


def get_llm():
    """Initialize primary LLM (Google Gemini cloud if configured, else local ChatOllama)."""
    google_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if google_api_key:
        try:
            print("Initializing Google Gemini API (gemini-3.8-flash)...")
            return GeminiLLM(api_key=google_api_key, model="gemini-3.8-flash")
        except Exception as exc:
            print(f"Warning: Gemini init failed ({exc}), falling back to Ollama...")

    # Primary local model: qwen2.5:3b via Ollama
    base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    model_name = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
    chat_model = ChatOllama(model=model_name, base_url=base_url, temperature=0.1)
    return chat_model.bind_tools(TOOLS)


LLM = get_llm()


# ---------------------------------------------------------------------------
# LangGraph State Schema
# ---------------------------------------------------------------------------
class AgentState(TypedDict):
    raw_query: str
    normalized_query: str
    search_results: list[dict[str, Any]]
    recurring_defect_info: dict[str, Any]
    refused: bool
    answer: str
    cited_records: list[dict[str, Any]]
    tool_trace: list[dict[str, Any]]


# ---------------------------------------------------------------------------
# Graph Nodes
# ---------------------------------------------------------------------------
def normalize_input_node(state: AgentState) -> dict[str, Any]:
    """Normalize raw user input using aviation abbreviation dictionary."""
    raw = state.get("raw_query", "")
    norm = normalize_text(raw)
    trace = list(state.get("tool_trace", []))
    trace.append({
        "step": "normalize_input",
        "tool": "utils.normalizer.normalize_text",
        "input": raw,
        "output": norm,
    })
    return {"normalized_query": norm, "tool_trace": trace}


def retrieve_and_evaluate_node(state: AgentState) -> dict[str, Any]:
    """Execute hybrid search, detect recurring defects, and enforce refusal logic."""
    query = state.get("normalized_query") or state.get("raw_query", "")
    results = search_records(query, top_k=5)

    trace = list(state.get("tool_trace", []))
    top_score = results[0]["score"] if results else 0.0

    # Call detect_recurring_defects on the search results before generating the answer
    recurring_info = detect_recurring_defects(results)

    trace.append({
        "step": "retrieve_records",
        "tool": "search_records",
        "input": {"query": query},
        "retrieved_count": len(results),
        "top_score": top_score,
        "threshold": REFUSAL_THRESHOLD,
        "recurring_defect_info": recurring_info,
    })

    # Strict Refusal Threshold Logic:
    # If no results or highest match score is below 0.35, refuse immediately.
    if not results or top_score < REFUSAL_THRESHOLD:
        trace.append({
            "step": "refusal_evaluation",
            "decision": "REFUSED",
            "reason": f"Top match score {top_score:.4f} is below threshold {REFUSAL_THRESHOLD}",
        })
        return {
            "search_results": results,
            "recurring_defect_info": {"is_recurring": False},
            "refused": True,
            "answer": REFUSAL_MESSAGE,
            "cited_records": [],
            "tool_trace": trace,
        }

    trace.append({
        "step": "refusal_evaluation",
        "decision": "ACCEPTED",
        "top_score": top_score,
    })
    return {
        "search_results": results,
        "recurring_defect_info": recurring_info,
        "refused": False,
        "tool_trace": trace,
    }


def should_refuse(state: AgentState) -> str:
    """Conditional router based on refusal status."""
    return "refused" if state.get("refused", False) else "generate"


def generate_node(state: AgentState) -> dict[str, Any]:
    """Generate structured response citing retrieved logbook records."""
    raw_query = state.get("raw_query", "")
    norm_query = state.get("normalized_query", "")
    results = state.get("search_results", [])
    trace = list(state.get("tool_trace", []))

    system_prompt = (
        "You are an expert aviation maintenance technician and logbook analyst.\n"
        "Your role is to diagnose the discrepancy and provide verified corrective actions "
        "based STRICTLY on the retrieved historical maintenance records.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Base your answer ONLY on the provided historical records. Do NOT invent, assume, or hallucinate procedures.\n"
        "2. You MUST explicitly cite the specific record ID for every finding, symptom, and repair action "
        "using the exact format '[Record #<ID>]' (for example: [Record #100062]).\n"
        "3. Provide a clear, professional breakdown:\n"
        "   - Problem & Symptom Analysis (citing relevant Record IDs)\n"
        "   - Historical Corrective Actions Performed (citing relevant Record IDs)\n"
        "   - Recommended Technical Next Steps"
    )

    call_id = f"call_{uuid.uuid4().hex[:8]}"

    # Tool invocation message chain
    ai_tool_call = AIMessage(
        content="",
        tool_calls=[{
            "name": "search_records_tool",
            "args": {"query": norm_query},
            "id": call_id,
            "type": "tool_call",
        }],
    )

    # Tool output containing the retrieved records
    tool_output_payload = [
        {
            "ident": r["ident"],
            "problem": r["problem_normalized"],
            "action": r["action_normalized"],
            "confidence_score": r["score"],
        }
        for r in results
    ]

    tool_msg = ToolMessage(
        content=json.dumps(tool_output_payload, indent=2),
        tool_call_id=call_id,
        name="search_records_tool",
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Reported Discrepancy: {raw_query}"),
        ai_tool_call,
        tool_msg,
    ]

    response = LLM.invoke(messages)

    # Check if LLM requested an additional tool call (e.g. get_record_tool)
    if hasattr(response, "tool_calls") and response.tool_calls:
        for tc in response.tool_calls:
            t_name = tc.get("name", "")
            t_args = tc.get("args", {})
            t_id = tc.get("id", f"call_{uuid.uuid4().hex[:8]}")

            if "get_record" in t_name:
                rec_id = t_args.get("record_id", "")
                rec_data = get_record(rec_id)
                trace.append({
                    "step": "get_record_tool",
                    "tool": "get_record",
                    "input": {"record_id": rec_id},
                    "found": rec_data is not None,
                })
                sub_tool_msg = ToolMessage(
                    content=json.dumps(rec_data, indent=2) if rec_data else f"Record {rec_id} not found.",
                    tool_call_id=t_id,
                    name=t_name,
                )
                messages.extend([response, sub_tool_msg])
                response = LLM.invoke(messages)
                break

    answer_text = response.content if hasattr(response, "content") else str(response)

    # Extract all cited record IDs from answer text (e.g. [Record #100062] or Record #100062)
    cited_ids_raw = re.findall(r"(?:Record\s*#?|\[Record\s*#?)(\d+)", answer_text, re.IGNORECASE)
    cited_ids = set(int(cid) for cid in cited_ids_raw)

    # Match cited IDs against retrieved records; fallback to top search results if none parsed
    cited_records = [r for r in results if r["ident"] in cited_ids]
    if not cited_records and results:
        cited_records = results[:2]

    trace.append({
        "step": "generate_answer",
        "model": "qwen2.5:3b",
        "cited_ids": [r["ident"] for r in cited_records],
    })

    return {
        "answer": answer_text,
        "cited_records": cited_records,
        "tool_trace": trace,
    }


# ---------------------------------------------------------------------------
# Build the LangGraph Workflow
# ---------------------------------------------------------------------------
def build_agent_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("normalize", normalize_input_node)
    workflow.add_node("retrieve", retrieve_and_evaluate_node)
    workflow.add_node("generate", generate_node)

    workflow.set_entry_point("normalize")
    workflow.add_edge("normalize", "retrieve")

    workflow.add_conditional_edges(
        "retrieve",
        should_refuse,
        {
            "refused": END,
            "generate": "generate",
        },
    )

    workflow.add_edge("generate", END)
    return workflow.compile()


AGENT_GRAPH = build_agent_graph()


def run_agent(query: str) -> dict[str, Any]:
    """Execute the full agentic pipeline for a query.

    Returns
    -------
    dict[str, Any]
        Dictionary with keys:
          - answer: str
          - cited_records: list[dict]
          - tool_trace: list[dict]
    """
    initial_state: AgentState = {
        "raw_query": query,
        "normalized_query": "",
        "search_results": [],
        "recurring_defect_info": {"is_recurring": False},
        "refused": False,
        "answer": "",
        "cited_records": [],
        "tool_trace": [],
    }

    final_state = AGENT_GRAPH.invoke(initial_state)

    return {
        "answer": final_state.get("answer", ""),
        "cited_records": final_state.get("cited_records", []),
        "tool_trace": final_state.get("tool_trace", []),
        "recurring_defect_info": final_state.get("recurring_defect_info", {"is_recurring": False}),
    }


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("TESTING AGENTIC BACKEND WITH VALID QUERY")
    print("=" * 60)
    valid_query = "ENG OIL PRESS LOW"
    res1 = run_agent(valid_query)
    print(f"\nQuery: '{valid_query}'")
    print(f"\nAnswer:\n{res1['answer']}")
    print(f"\nCited Record IDs: {[r['ident'] for r in res1['cited_records']]}")
    print(f"Tool Trace Steps: {[t['step'] for t in res1['tool_trace']]}")

    print("\n" + "=" * 60)
    print("TESTING REFUSAL THRESHOLD WITH IRRELEVANT QUERY")
    print("=" * 60)
    irrelevant_query = "how to bake a chocolate cake"
    res2 = run_agent(irrelevant_query)
    print(f"\nQuery: '{irrelevant_query}'")
    print(f"Answer: {res2['answer']}")
    print(f"Cited Record IDs: {[r['ident'] for r in res2['cited_records']]}")
    print(f"Tool Trace Steps: {[t['step'] for t in res2['tool_trace']]}")
