from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_deepseek import ChatDeepSeek
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from app.core.config import settings

PROVIDER_REGISTRY = {
    "groq": ChatGroq,
    "google": ChatGoogleGenerativeAI,
    "deepseek": ChatDeepSeek,
    "nvidia": ChatNVIDIA,
    "ollama": ChatOllama,
}

PROVIDER_API_KEYS = {
    "groq": settings.GROQ_API_KEY,
    "google": settings.GOOGLE_API_KEY,
    "deepseek": settings.DEEPSEEK_API_KEY,
    "nvidia": settings.NVIDIA_API_KEY,
    "ollama": None,  # run local without key
}

PROVIDER_DEFAULT_MODEL = {
    "groq": "llama-3.3-70b-versatile",
    "google": "gemini-3.6-flash",
    "ollama": "llama3.1",
    "deepseek": "deepseek-v4-flash",
    "nvidia": "meta/llama-3.3-70b-instruct",
}

ROLE_DEFAULTS = {
    "llm_router": ("ollama", "llama3.1"),
    "llm_generate": ("deepseek", "deepseek-v4-flash"),
    "llm_tool_selector": ("google", "gemini-3.6-flash"),
    "llm_summarizer": ("groq", "llama-3.3-70b-versatile"),
}


def _build_llm(provider: str, model: str, temperature: float = 0.0, **kwargs):
    if provider not in PROVIDER_REGISTRY:
        raise ValueError(f"Unknown LLM provider: {provider}")

    llm_class = PROVIDER_REGISTRY[provider]
    api_key = PROVIDER_API_KEYS.get(provider)

    if api_key:
        kwargs["api_key"] = api_key

    return llm_class(model=model, temperature=temperature, **kwargs)


def get_llm(
    role: str,
    provider: str | None = None,
    model: str | None = None,
    temperature: float = 0.0,
    **kwargs,
):
    """
    Build an LLM instance for a given agent role.

    Args:
        role: Required. Identifies which step in the agent graph this LLM
            serves (e.g. "llm_router", "llm_generate", "llm_tool_selector",
            "llm_summarizer"). Must exist in ROLE_DEFAULTS.
        provider: Optional. Overrides the default provider configured for
            this role (e.g. "groq", "google", "deepseek", "nvidia", "ollama").
        model: Optional. Overrides the default model. If provided, `provider`
            must also be provided, since a model name alone cannot be mapped
            to the correct provider.
        temperature: Sampling temperature, default 0.0.
        **kwargs: Extra keyword arguments passed through to the underlying
            LangChain chat model class.

    Behavior:
        get_llm(role="llm_generate")
            -> Uses the role's default provider and default model
               (e.g. deepseek / deepseek-v4-flash).

        get_llm(role="llm_generate", provider="nvidia")
            -> Switches provider; automatically uses that NEW provider's
               default model (not the role's original default model).

        get_llm(role="llm_generate", provider="nvidia", model="...")
            -> Uses exactly the provider and model specified.

        get_llm(role="llm_generate", model="gemini-2.5-flash")
            -> Raises an error immediately, because `model` was given
               without `provider` and the correct provider cannot be
               inferred from the model name alone.

        get_llm()  (role omitted)
            -> Raises a Python TypeError immediately, since `role` is a
               required argument with no default value.

    Raises:
        ValueError: if `role` is not a recognized role, if `provider` is
            not a recognized provider, or if `model` is given without
            `provider`.
    """
    if role not in ROLE_DEFAULTS:
        raise ValueError(f"Unknown LLM role: {role}")

    if model and not provider:
        raise ValueError(
            "Passing 'model' must include the corresponding 'provider', "
            "because it's impossible to automatically infer which provider the model belongs to."
        )

    default_provider, default_model = ROLE_DEFAULTS[role]
    final_provider = provider or default_provider

    if model:
        final_model = model
    elif provider and provider != default_provider:
        # Change provider but don't specify model → Use the default model of the NEW provider.
        # Not the default model of the role (because those two belong to two different providers).
        final_model = PROVIDER_DEFAULT_MODEL[provider]
    else:
        final_model = default_model

    return _build_llm(final_provider, final_model, temperature=temperature, **kwargs)
