import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { callRealLlm, llmStatus } from "./server/llm";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client on server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI:", err);
    return null;
  }
};

// Helper function to generate numeric hash code for string seed
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// API Route for Drill-Down AI Generation
app.post("/api/explain", async (req, res) => {
  const { topic, depthIndex = 1, totalLayers = 5, previousLayers = [] } = req.body;

  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "Topic is required" });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Return structured fallback response if no API key is provided
    return res.json({
      success: true,
      isFallback: true,
      layer: generateFallbackLayer(topic, depthIndex, totalLayers)
    });
  }

  try {
    const prompt = `You are an expert scientific explainer for an interactive "Sổ Tay Kiến Thức" (Drill-Down Explainer) app. 
Generate a rich, multi-layered scientific and visual drill-down explanation IN VIETNAMESE (Tiếng Việt) for the topic: "${topic}".
We are currently generating Layer ${depthIndex} out of ${totalLayers} total layers of drill-down depth.

Provide output in JSON matching this exact structure:
- depthLabel: A concise uppercase depth indicator in Vietnamese (e.g. "ĐỘ SÂU: 15KM", "ĐỘ SÂU: 0,1 NANOMÉT", "LỚP 2: ĐĨA TÍCH TỤ").
- title: An editorial plate-style title in Vietnamese (e.g. "Hình ${depthIndex}: Cấu Trúc Bên Trong Của ${topic}").
- subtitle: A 1-line descriptive subtitle in Vietnamese summarizing this depth level.
- imagePrompt: A detailed English prompt describing the visual scientific diagram, cross-section, or micro structure for this specific layer of ${topic} (e.g. "detailed cross section scientific diagram of human heart interior ventricles and valves, vintage educational illustration style, clean lighting"). MUST BE IN ENGLISH for AI image rendering.
- summary: A detailed 2-3 paragraph captivating scientific explanation in Vietnamese of what exists at this specific layer of depth.
- keyMetrics: Array of 3 key scientific metrics/data points in Vietnamese (label, value).
- hotspots: Array of 3 interactive visual annotations on this layer with x (10-90), y (10-90) coordinates percentage, label (in Vietnamese), and description (in Vietnamese).
- quiz: Array of 1 or 2 multiple-choice questions in Vietnamese to test understanding of this layer (question, options array of 4 strings in Vietnamese, correctAnswerIndex 0-3, explanation in Vietnamese).
- suggestedNextTopics: Array of 3 compelling drill-down paths deeper into this layer in Vietnamese.
- audioScript: A clear, engaging 2-sentence script for voice narration in Vietnamese.`;

    const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let responseText = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                depthLabel: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyMetrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                hotspots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      label: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["x", "y", "label", "description"]
                  }
                },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctAnswerIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswerIndex", "explanation"]
                  }
                },
                suggestedNextTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                audioScript: { type: Type.STRING }
              },
              required: ["depthLabel", "title", "summary", "keyMetrics", "hotspots", "imagePrompt"]
            }
          }
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Gemini model ${modelName} failed or rate-limited:`, modelErr?.message || modelErr);
      }
    }

    if (!responseText) {
      throw new Error("All Gemini models were unavailable or rate limited");
    }

    const parsed = JSON.parse(responseText);
    
    // Generate topic-relevant image URL based on Gemini's imagePrompt
    const rawImagePrompt = parsed.imagePrompt || `${topic} scientific cross section layer ${depthIndex}`;
    const cleanImagePrompt = encodeURIComponent(`detailed scientific cross-section diagram of ${rawImagePrompt}, educational infographic plate style, high resolution`);
    const seed = Math.abs(hashCode(`${topic}_${depthIndex}`));
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${cleanImagePrompt}?width=1024&height=640&nologo=true&seed=${seed}`;

    const layer = {
      depthIndex,
      depthLabel: parsed.depthLabel || `ĐỘ SÂU: LỚP ${depthIndex}`,
      title: parsed.title || `Hình ${depthIndex}: ${topic} Lớp ${depthIndex}`,
      subtitle: parsed.subtitle || `Khám phá các cơ chế chuyên sâu của ${topic}`,
      imageUrl: generatedImageUrl,
      imageAlt: `Sơ đồ khoa học của ${topic} ở lớp ${depthIndex}`,
      summary: parsed.summary || `Giải thích khoa học chi tiết về ${topic} ở độ sâu lớp ${depthIndex}.`,
      keyMetrics: parsed.keyMetrics || [
        { label: "Depth Level", value: `${depthIndex} / ${totalLayers}` },
        { label: "Scale", value: depthIndex === 1 ? "Macro" : depthIndex < 4 ? "Micro" : "Quantum" },
        { label: "Complexity", value: "High" }
      ],
      hotspots: (parsed.hotspots || []).map((h: any, idx: number) => ({
        id: h.id || `h_${depthIndex}_${idx}`,
        x: Math.min(90, Math.max(10, Number(h.x) || (20 + idx * 25))),
        y: Math.min(90, Math.max(10, Number(h.y) || (30 + idx * 20))),
        label: h.label || `Point ${idx + 1}`,
        description: h.description || `Key structural component of ${topic}`
      })),
      quiz: (parsed.quiz || []).map((q: any, idx: number) => ({
        id: q.id || `q_${depthIndex}_${idx}`,
        question: q.question,
        options: q.options || [],
        correctAnswerIndex: q.correctAnswerIndex ?? 0,
        explanation: q.explanation || ""
      })),
      suggestedNextTopics: parsed.suggestedNextTopics || [
        `Drill deeper into layer ${depthIndex + 1}`,
        `Examine molecular structure of ${topic}`,
        `Analyze thermal & energetic behavior`
      ],
      audioScript: parsed.audioScript || `Layer ${depthIndex} of ${topic}: ${parsed.summary?.slice(0, 150) || ""}`
    };

    return res.json({ success: true, layer });
  } catch (err: any) {
    console.error("Gemini API Error in /api/explain:", err);
    return res.json({
      success: true,
      isFallback: true,
      layer: generateFallbackLayer(topic, depthIndex, totalLayers)
    });
  }
});

// Helper for generating high quality fallback layer when API is unavailable or offline
function generateFallbackLayer(topic: string, depthIndex: number, totalLayers: number) {
  const depthLabels = [
    "ĐỘ SÂU: 0KM (BỀ MẶT TỔNG QUAN)",
    "ĐỘ SÂU: 15KM (CẤU TRÚC DƯỚI LÒNG ĐẤT)",
    "ĐỘ SÂU: 85KM (RANH GIỚI TRUYỀN DẪN)",
    "ĐỘ SÂU: 400KM (NỀN TẢNG VI MÔ)",
    "ĐỘ SÂU: 2.900KM (LÕI LƯỢNG TỬ & NGUỒN NĂNG LƯỢNG)"
  ];

  return {
    depthIndex,
    depthLabel: depthLabels[(depthIndex - 1) % depthLabels.length],
    title: `Hình ${depthIndex}: Động Lực Học Cấu Trúc Của ${topic}`,
    subtitle: `Lớp ${depthIndex} trên tổng số ${totalLayers} • Cơ chế ngầm và các thuộc tính nền tảng`,
    imageUrl: getImageForTopicLayer(topic, depthIndex),
    imageAlt: `Bản vẽ minh họa khoa học về ${topic} ở lớp ${depthIndex}`,
    summary: `Ở độ sâu lớp ${depthIndex}, ${topic} dần hé lộ các cơ chế cấu trúc bên trong. Dưới áp suất hệ thống gia tăng và mật độ năng lượng tích tụ, sự tương tác giữa các thành phần đơn lẻ tạo nên các hiện tượng vĩ mô quan sát được ở bề mặt.`,
    keyMetrics: [
      { label: "Mức Độ Sâu", value: `${depthIndex} / ${totalLayers}` },
      { label: "Năng Lượng Tương Đối", value: `${depthIndex * 240} MW/m³` },
      { label: "Mật Độ Cấu Trúc", value: `${(100 / depthIndex).toFixed(1)}% mật độ` }
    ],
    hotspots: [
      { id: `h_${depthIndex}_1`, x: 30, y: 40, label: "Ống Truyền Tải Chính", description: "Kênh dẫn truyền năng lượng và vật chất chính giữa các lớp cấu trúc liền kề." },
      { id: `h_${depthIndex}_2`, x: 70, y: 55, label: "Vùng Độ Dốc Lõi", description: "Vùng chuyển giao năng lượng cường độ cao và cân bằng ranh giới pha." },
      { id: `h_${depthIndex}_3`, x: 50, y: 75, label: "Tầng Bể Chứa", description: "Vùng lưu trữ sâu duy trì sự ổn định hệ thống dài hạn." }
    ],
    quiz: [
      {
        id: `q_${depthIndex}_1`,
        question: `Yếu tố nào chi phối sự chuyển tiếp giữa Lớp ${depthIndex} và các tầng liền kề trong ${topic}?`,
        options: [
          "Động lực học áp suất và độ dốc nhiệt",
          "Chuyển động ngẫu nhiên bên ngoài",
          "Áp suất khí quyển cố định",
          "Sự đóng nảy trọng lực tĩnh"
        ],
        correctAnswerIndex: 0,
        explanation: "Các hệ thống vật lý tự sắp xếp thành các lớp riêng biệt do độ dốc áp suất, mật độ và năng lượng nhiệt."
      }
    ],
    suggestedNextTopics: [
      `Khoan sâu hơn vào lớp ${Math.min(depthIndex + 1, totalLayers)}`,
      `Khám phá cấu trúc phân tử của ${topic}`,
      `Phân tích dao động nhiệt và mô hình sóng`
    ],
    audioScript: `Lớp ${depthIndex} của ${topic}. Ở độ sâu này, các cơ chế bên trong cho thấy cách năng lượng và lực cấu trúc duy trì trạng thái cân bằng.`
  };
}

function getImageForTopicLayer(topic: string, depthIndex: number): string {
  const cleanTopicPrompt = encodeURIComponent(`detailed scientific cross-section diagram of ${topic} at depth level ${depthIndex}, educational infographic plate style, high resolution`);
  const seed = Math.abs(hashCode(`${topic}_${depthIndex}`));
  return `https://image.pollinations.ai/prompt/${cleanTopicPrompt}?width=1024&height=640&nologo=true&seed=${seed}`;
}

app.get("/api/ai/status", (_req, res) => res.json(llmStatus()));

app.post("/api/ai/explore", async (req, res) => {
  const { prompt, retry = false } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.trim().split(/\s+/).length < 3) {
    return res.status(400).json({ error: "Prompt phải có ít nhất 3 từ" });
  }
  try {
    const result = await callRealLlm(
      "Bạn là giáo viên KHTN lớp 8 và chuyên gia hướng dẫn học sinh dùng AI. Chỉ trả về JSON hợp lệ, không markdown.",
      `Học sinh viết prompt: ${prompt}\n${retry ? "Hãy tạo một câu hỏi vận dụng mới, khác câu trước nhưng cùng chủ đề." : ""}\n\nTạo JSON theo cấu trúc sau:\n{"topic":"tên chủ đề","refined":"prompt đã chau chuốt, có bối cảnh lớp 8 và ràng buộc rõ","why":"một câu giải thích vì sao prompt được cải thiện","text":"đoạn giải thích 120-180 từ, chính xác và dễ hiểu","question":"câu hỏi vận dụng cần dùng phần giải thích","options":["phương án A","phương án B","phương án C","phương án D"],"answer":0,"explanation":"giải thích đáp án","deep":["hướng đào sâu 1","hướng đào sâu 2","hướng đào sâu 3"],"voice":"lời đọc 2 câu ngắn","visual":"density hoặc pressure"}. answer là số nguyên 0-3.`
    );
    if (result.provider !== "fallback") return res.json({ ...result.data, source: result.provider });
  } catch (error) {
    console.error("/api/ai/explore failed:", error);
  }
  return res.json({ source: "fallback", error: "LLM chưa sẵn sàng" });
});

app.post("/api/ai/trap", async (req, res) => {
  const { topic, claim, messages = [] } = req.body || {};
  if (!claim) return res.status(400).json({ error: "Claim is required" });
  try {
    const result = await callRealLlm(
      "Bạn là AI Bẫy lỗi dạy KHTN lớp 8. Chỉ trả về JSON hợp lệ, không markdown. Không được nói thẳng lỗi trước khi học sinh nhận ra; hãy dùng gợi ý Socratic tăng dần. Sau lượt 6 được chỉ rõ.",
      `Chủ đề: ${topic}\nPhát biểu có lỗi: ${claim}\nLịch sử: ${JSON.stringify(messages)}\n\nTrả về JSON: {"reply":"phản hồi ngắn cho học sinh","solved":false,"selfFound":false,"errorSummary":"lỗi dành cho giáo viên","turns":1}. Nếu học sinh đã chỉ đúng bản chất lỗi, solved=true và selfFound=true nếu chưa cần AI nói thẳng. turns bằng số lượt học sinh đã nói.`
    );
    if (result.provider !== "fallback") return res.json({ ...result.data, source: result.provider });
  } catch (error) {
    console.error("/api/ai/trap failed:", error);
  }
  return res.json({ source: "fallback", reply: "Hãy đối chiếu tên đại lượng với đơn vị và công thức. Em thấy chỗ nào chưa hợp lý?", solved: false, selfFound: false, turns: messages.filter((m: any) => m.role === "student").length });
});

// Start Express + Vite Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
