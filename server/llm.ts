import { GoogleGenAI } from "@google/genai";

export type LlmProvider = "openai-compatible" | "gemini" | "fallback";

type LlmConfig = { provider: LlmProvider; baseUrl?: string; apiKey?: string; model?: string };

function getLlmConfig(): LlmConfig {
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai-compatible",
      baseUrl: (process.env.OPENAI_API_BASE || "https://api.openai.com/v1").replace(/\/$/, ""),
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
    };
  }
  if (process.env.BUILT_IN_FORGE_API_KEY && process.env.BUILT_IN_FORGE_API_URL) {
    return {
      provider: "openai-compatible",
      baseUrl: process.env.BUILT_IN_FORGE_API_URL.replace(/\/$/, ""),
      apiKey: process.env.BUILT_IN_FORGE_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
    };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: "gemini", apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL || "gemini-2.5-flash" };
  }
  return { provider: "fallback" };
}

export async function callRealLlm(system: string, user: string): Promise<{ data: any; provider: LlmProvider }> {
  const config = getLlmConfig();
  if (config.provider === "openai-compatible") {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        response_format: { type: "json_object" },
        max_completion_tokens: 1800,
      }),
    });
    if (!response.ok) throw new Error(`LLM HTTP ${response.status}: ${await response.text()}`);
    const json: any = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM returned empty content");
    return { data: JSON.parse(content), provider: config.provider };
  }
  if (config.provider === "gemini") {
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const response = await ai.models.generateContent({
      model: config.model || "gemini-2.5-flash",
      contents: `${system}\n\n${user}`,
      config: { responseMimeType: "application/json" },
    });
    if (!response.text) throw new Error("Gemini returned empty content");
    return { data: JSON.parse(response.text), provider: config.provider };
  }
  return { data: null, provider: "fallback" };
}

export function llmStatus() {
  const config = getLlmConfig();
  return { provider: config.provider, model: config.model || null, configured: config.provider !== "fallback" };
}
