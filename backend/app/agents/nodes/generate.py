from langchain_core.messages import SystemMessage

from app.agents.prompts import SYSTEM_PROMPT
from app.agents.config import get_llm
from app.agents.states import AgentState


async def generate(state: AgentState):

    llm = get_llm(role="llm_generate", provider="google", model="gemini-3.6-flash")

    response = await llm.ainvoke(
        [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    )
    return {"messages": [response]}
