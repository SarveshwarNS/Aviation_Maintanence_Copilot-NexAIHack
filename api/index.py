"""Vercel Serverless Function entrypoint for Aviation Maintenance Copilot FastAPI backend."""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure project root directory is available in python path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app import app


class VercelPathMiddleware:
    """Normalize paths rewritten by Vercel serverless function runtime.

    Vercel rewrites route requests to FastAPI using the destination path
    (e.g., '/api/index.py' or '/api'), or pass the original path in 'x-matched-path'.
    This middleware maps them to the canonical routes expected by the application.
    """

    def __init__(self, asgi_app):
        self.asgi_app = asgi_app

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "http":
            path = scope.get("path", "")
            method = scope.get("method", "GET")

            # Check for Vercel's matched path header
            headers = dict(scope.get("headers", []))
            matched_path = headers.get(b"x-matched-path", b"").decode("utf-8")

            if matched_path and not matched_path.startswith("/api/index"):
                scope["path"] = matched_path
            elif path in ("/api/index.py", "/api/index", "/api", "/api/"):
                if method == "POST":
                    scope["path"] = "/chat"
                else:
                    scope["path"] = "/"
            elif path in ("/api/chat", "/api/chat/"):
                scope["path"] = "/chat"

        await self.asgi_app(scope, receive, send)


app = VercelPathMiddleware(app)
