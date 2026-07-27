# Backend & AI Agent Development Rules

## 1. Tech Stack
* **Language**: Python 3.11+ (Strict type hinting required)
* **Framework**: FastAPI (Asynchronous execution)
* **AI Core**: LangChain / LangGraph
* **Knowledge Base**: RAG (Retrieval-Augmented Generation)
* **Protocol**: Model Context Protocol (MCP) for tools and data integration

## 2. Architecture & Directory Pattern
* **Pattern**: Separation of Concerns. Never write LLM or Prompt logic inside FastAPI routers.
* **Layers**: `api/` (HTTP/WS endpoints) -> `services/` (Business logic) -> `agents/` (LangChain/MCP logic) -> `repositories/` (Database/Vector DB operations).
* **MCP Integration**: Define all external systems (DBs, APIs) as MCP servers/clients. Follow strict MCP schemas for tool-calling.

## 3. Coding Guidelines for AI & Humans
* **Async First**: Use `async def` for all API endpoints, LLM invocations, and MCP tool executions.
* **Streaming**: AI chat endpoints MUST use FastAPI's `StreamingResponse` with LangChain's `astream_events` or `astream` to push real-time tokens.
* **Type Hints**: All function signatures MUST include explicit types for arguments and returns.
* **Pydantic**: Use Pydantic v2 for strict request validation and structured LLM outputs via `.with_structured_output()`.

## 4. Error Handling & Security
* **Guardrails**: Wrap all LLM and RAG interactions in try-except blocks. Handle API timeouts and token limits gracefully.
* **Logging**: Use a structured logger. Never log raw User PII (Personally Identifiable Information). Only log prompt templates, never raw production variables.
