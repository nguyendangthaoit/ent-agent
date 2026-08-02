from langgraph.graph import END, START, StateGraph
from app.agents.states import AgentState
from app.agents.nodes.generate import generate


def create_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("generate", generate)
    graph.add_edge(START, "generate")
    graph.add_edge("generate", END)

    return graph
