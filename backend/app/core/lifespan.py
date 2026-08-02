import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI
from langgraph.checkpoint.redis.aio import AsyncRedisSaver
from app.core.config import settings
from app.agents.graph import create_graph


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[SYSTEM] Connecting and initializing Async Redis Checkpointer...")
    try:
        redis_context = AsyncRedisSaver.from_conn_string(settings.REDIS_URL)
        async with redis_context as saver:
            await saver.setup()
            app.state.checkpointer = saver
            # Setup work-loop graph configurations
            graph = create_graph()
            app.state.graph_app = graph.compile(checkpointer=saver)
            print(
                "[SYSTEM] Successfully initialized Async Redis Checkpointer and Graph configurations!"
            )
            yield
        print("[SYSTEM] Closing Redis Checkpointer safely...")
    except Exception as env_err:
        print(f"[SYSTEM CRITICAL ERROR INITIALIZING REDIS]: {traceback.format_exc()}")
        raise env_err
