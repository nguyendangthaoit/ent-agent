# Ent-Agent Monorepo

Enterprise AI Agent platform built with a high-performance Python backend and a modern Next.js frontend UI.

## 📁 Repository Structure

```text
ent-agent/
├── .continue/             # Shared AI assistant configuration (Continue extension)
├── backend/               # FastAPI, LangChain/LangGraph, RAG, MCP
│   └── backend-rules.md   # Dedicated backend engineering rules
├── frontend/              # Next.js (App Router), Tailwind CSS, Shadcn UI
│   └── frontend-rules.md  # Dedicated frontend UI rules
└── README.md              # This file
```

---

## 🛠️ 1. Global AI Assistant Setup (VS Code + Continue)

To ensure the entire team writes code adhering to the same architectural standards, we use the **Continue** extension in VS Code.

1. Install the **Continue** extension from the VS Code Marketplace.
2. The extension will automatically merge the workspace configuration found in `.continue/config.json`.
3. **How to code with AI:** Whenever you ask the chat assistant to write or refactor code, use the `@` context provider to attach the relevant rules file:
   * For backend tasks: `@backend-rules.md <your instruction>`
   * For frontend tasks: `@frontend-rules.md <your instruction>`

---

## 🚀 2. Backend Installation & Setup

The backend handles AI reasoning, RAG pipeline orchestrations, and Model Context Protocol (MCP) integrations.

### Prerequisites
* Python 3.11 or higher
* `pip` or `uv` (recommended package manager)

### Quick Start Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and fill in your API keys (LLMs, Vector DBs):
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI development server:
   ```bash
   fastapi dev main.py --port 8000
   ```
   *The Swagger interactive API documentation will be available at `http://localhost:8000/docs`.*

---

## 💻 3. Frontend Installation & Setup

The frontend provides a real-time, streaming conversational user interface for interacting with the AI Agent.

### Prerequisites
* Node.js 18.x or higher
* `npm`, `yarn`, or `pnpm` (recommended)

### Quick Start Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install  # or npm install / yarn install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Run the Next.js development server:
   ```bash
   pnpm dev
   ```
   *Open `http://localhost:3000` in your browser to view the application.*

---

## 🛑 4. Development Workflow & Git Best Practices

* **Branch Naming**: Always use lowercase with hyphens. Prefix with task types:
  * `feature/backend-mcp-tool`
  * `feature/frontend-chat-stream`
  * `bugfix/backend-token-limit`
* **Local Scope Isolation**: When working heavily on one side of the stack, open that specific folder (`backend/` or `frontend/`) as your root workspace in VS Code. This isolates your dependencies and prevents local AI context indexing bloat.
* **Sensitive Data**: Never commit `.env` or configuration files with exposed API keys. The global `.gitignore` is already set up to safeguard these files.
