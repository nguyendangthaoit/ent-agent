# Frontend UI Development Rules

## 1. Tech Stack
* **Framework**: Next.js (App Router) with TypeScript
* **Styling**: Tailwind CSS
* **UI Components**: Shadcn UI / Radix Primitives
* **State Management**: Zustand (Global UI states) & React Query (Server-state caching)
* **AI Interaction**: Vercel AI SDK (for smooth streaming hooks like `useChat`)

## 2. UI/UX Rules for AI Agent Interface
* **Streaming UI**: Chat interfaces must support real-time token streaming. Render text smoothly using `@ai-sdk/react` or React Server Components streaming capabilities.
* **Markdown Rendering**: Render agent responses via `react-markdown`. Code blocks must have copy-to-clipboard buttons and syntax highlighting.
* **Thinking State**: Always display a dedicated "Thinking/Processing" indicator when the AI agent is reasoning or calling MCP tools.
* **Error Resilience**: Implement React Error Boundaries around chat containers. If an API stream cuts off mid-way, provide a "Retry" or "Regenerate" trigger.

## 3. Coding Guidelines for AI & Humans
* **Strict TypeScript**: No `any` type allowed. Declare comprehensive interfaces/types for all Component Props, API responses, and chat messages.
* **Component Architecture**: Keep components modular. Separate UI presentation layers from streaming/fetching hooks.
* **Naming Conventions**: Use `kebab-case` for folder names, `PascalCase` for React components (e.g., `ChatMessage.tsx`).
* **Design Tokens**: Adhere strictly to Tailwind utility classes paired with CSS variables provided by Shadcn UI (e.g., `text-muted-foreground`, `bg-background`). Do not hardcode hex color codes.
