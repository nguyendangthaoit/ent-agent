from typing import Annotated, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


# state for the graph
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
