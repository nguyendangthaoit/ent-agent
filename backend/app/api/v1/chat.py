from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest
from app.agents.states import AgentState
from app.agents.streaming import stream_langgraph_events

router = APIRouter()


@router.post("")
async def chat(request: ChatRequest, fastapi_req: Request):
    graph_app = fastapi_req.app.state.graph_app
    return StreamingResponse(
        stream_langgraph_events(request.prompt, request.session_id, graph_app),
        media_type="text/event-stream",
    )
