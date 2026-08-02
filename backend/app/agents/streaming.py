import json
import logging

from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableConfig

logger = logging.getLogger(__name__)


def extract_token(chunk_content) -> str:
    """Normalize chunk content across different LLM providers into plain text."""
    if isinstance(chunk_content, str):
        return chunk_content
    if isinstance(chunk_content, list) and chunk_content:
        first_item = chunk_content[0]
        if isinstance(first_item, dict) and "text" in first_item:
            return first_item["text"]
    return ""


async def stream_langgraph_events(
    prompt: str | None,
    session_id: str,
    graph_app,
    historic_config: RunnableConfig | None = None,
    node_target: str = "generate",
):
    try:
        config = historic_config or {"configurable": {"thread_id": session_id}}
        input_data = {"messages": [HumanMessage(content=prompt)]} if prompt else None

        async for event in graph_app.astream_events(
            input=input_data, config=config, version="v2"
        ):
            logger.debug("LangGraph event: %s", event)

            if (
                event["event"] == "on_chat_model_stream"
                and event["metadata"].get("langgraph_node") == node_target
            ):
                token = extract_token(event["data"]["chunk"].content)
                if token:
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception:
        logger.exception("Error during LangGraph streaming (session_id=%s)", session_id)
        yield f"data: {json.dumps({'type': 'error', 'message': 'An error occurred while generating the response.'})}\n\n"
