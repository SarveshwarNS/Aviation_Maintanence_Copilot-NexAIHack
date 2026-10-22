"""FastAPI backend service for Aviation Maintenance Copilot.

Provides:
  - POST /chat : Takes JSON {"query": str} and returns:
      {
        "answer": str,
        "cited_records": list[dict],
        "tool_trace": list[dict]
      }
  - GET / : Service health status and endpoint overview.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent import run_agent

app = FastAPI(
    title="Aviation Maintenance Copilot API",
    description="Agentic RAG assistant for commercial aviation maintenance logbooks.",
    version="1.0.0",
)

# Enable CORS for potential Streamlit or web UI integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str = Field(
        ...,
        description="Maintenance problem description, fault message, or query.",
        examples=["ENG OIL PRESS LOW", "HYD SYS A LEAK"],
    )


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Generated answer or refusal response.")
    cited_records: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Historical logbook records cited or used in the answer.",
    )
    tool_trace: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Execution trace of tool calls and intermediate agent steps.",
    )


@app.get("/")
def root() -> dict[str, Any]:
    """Health check and service information."""
    return {
        "status": "online",
        "service": "Aviation Maintenance Copilot API",
        "endpoints": {
            "chat": "POST /chat",
            "docs": "GET /docs",
        },
    }


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """Process a maintenance query through the agentic RAG pipeline."""
    raw_query = request.query.strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")

    try:
        result = run_agent(raw_query)
        return ChatResponse(
            answer=result.get("answer", ""),
            cited_records=result.get("cited_records", []),
            tool_trace=result.get("tool_trace", []),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing agent pipeline: {exc}",
        ) from exc


if __name__ == "__main__":
    import uvicorn

    host = "127.0.0.1"
    port = 8000
    print("\n" + "=" * 65)
    print("  AVIATION MAINTENANCE COPILOT - FASTAPI BACKEND")
    print("=" * 65)
    print(f"• Local Server URL : http://{host}:{port}")
    print(f"• Interactive Docs : http://{host}:{port}/docs")
    print(f"• Chat Endpoint    : POST http://{host}:{port}/chat")
    print("=" * 65 + "\n")

    uvicorn.run(app, host=host, port=port)
