from langchain_core.messages import SystemMessage

from app.agents.prompts import SYSTEM_PROMPT
from app.agents.config import get_llm
from app.agents.states import AgentState

llm = get_llm(role="llm_generate", provider="google", model="gemini-2.5-flash")


async def generate(state: AgentState):

    response = await llm.ainvoke(
        [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    )
    return {"messages": [response]}
