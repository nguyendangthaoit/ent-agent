from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.core.deps import CurrentUser
from app.schemas.chat import ChatRequest
from app.agents.streaming import stream_langgraph_events

router = APIRouter()


@router.post("")
async def chat(current_user: CurrentUser, request: ChatRequest, fastapi_req: Request):
    graph_app = fastapi_req.app.state.graph_app
    return StreamingResponse(
        stream_langgraph_events(request.prompt, request.session_id, graph_app),
        media_type="text/event-stream",
    )
