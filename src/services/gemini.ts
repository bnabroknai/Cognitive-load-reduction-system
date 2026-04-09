import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_SYSTEM_DATA } from "./mockData";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY" });

export const PASB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    system_name: {
      type: Type.STRING,
      description: "An energizing, personalized name for their new OS (e.g., 'The Clarity Hub')"
    },
    overview: {
      type: Type.STRING,
      description: "2-3 sentences explaining exactly how this system reduces their specific overwhelm and drives their goals."
    },
    core_workflows: {
      type: Type.ARRAY,
      description: "Array of 3 to 5 core workflows they should run.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          trigger: { type: Type.STRING, description: "When to do this (e.g., 'Every morning at 8am')" },
          tools_used: { type: Type.STRING, description: "Consolidated list of tools for this step" },
          exact_prompts_or_steps: { type: Type.STRING, description: "The exact prompt to copy/paste or step-by-step action" },
          automation_ideas: { type: Type.STRING, description: "Simple no-code automation idea for this step" },
          expected_time: { type: Type.STRING, description: "Realistic time to complete" }
        },
        required: ["name", "trigger", "tools_used", "exact_prompts_or_steps", "automation_ideas", "expected_time"]
      }
    },
    memory_and_review: {
      type: Type.STRING,
      description: "Instructions on how context carries forward + a 15-minute weekly review ritual."
    },
    monetization_or_output_loop: {
      type: Type.STRING,
      description: "How to tie this workflow directly to their stated output/income goals."
    },
    safeguards: {
      type: Type.ARRAY,
      description: "2-3 specific rules to prevent hallucination, load mitigations, and knowing when to pause AI.",
      items: { type: Type.STRING }
    },
    thirty_day_onramp: {
      type: Type.STRING,
      description: "A phased adoption plan so they don't try to implement everything on Day 1 and burn out."
    },
    expansion_notes: {
      type: Type.STRING,
      description: "Light next steps for agentic growth once they master this baseline."
    }
  },
  required: [
    "system_name",
    "overview",
    "core_workflows",
    "memory_and_review",
    "monetization_or_output_loop",
    "safeguards",
    "thirty_day_onramp",
    "expansion_notes"
  ]
};

const SYSTEM_INSTRUCTION = `
Role:
You are a Personal AI Systems Architect specializing in reducing cognitive fatigue and "brain fry" in the 2026 agentic landscape. Your objective is to convert chaotic, scattered user inputs into a minimal, sustainable Personal AI System that feels like a reliable daily OS, not another overwhelming set of experiments.

Core Principles for Generation:
1. Combat Brain Fry: Limit the system to 3-5 core workflows maximum. Ruthlessly suggest tool consolidation (e.g., if they use 4 writing AIs, pick the best one and cut the rest).
2. Agentic Readiness: Include simple memory hooks, repeatable loops, and gentle handoffs. Do not require complex coding unless the user explicitly asks for it.
3. Sustainability: Build in weekly review rituals, verification steps, and escalation to human judgment to prevent burnout.
4. Personalization: Make it feel custom. Explicitly reference their specific tools, energy constraints, and habits.
5. Practicality: Provide exact prompts, clear trigger conditions, and realistic time estimates. No vague advice.

Constraint: 
You must output ONLY valid JSON matching the exact schema provided.
`;

export interface PASBResponse {
  system_name: string;
  overview: string;
  core_workflows: {
    name: string;
    trigger: string;
    tools_used: string;
    exact_prompts_or_steps: string;
    automation_ideas: string;
    expected_time: string;
  }[];
  memory_and_review: string;
  monetization_or_output_loop: string;
  safeguards: string[];
  thirty_day_onramp: string;
  expansion_notes: string;
}

export async function generatePersonalAISystem(profile: {
  user_goals: string;
  user_tools_and_pains: string;
  user_energy_routine: string;
  user_output_intent: string;
  user_preferred_style: string;
}): Promise<PASBResponse> {
  const isMockMode = localStorage.getItem("PASB_MOCK_MODE") === "true";

  if (isMockMode) {
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000));
    return MOCK_SYSTEM_DATA;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Please set it in AI Studio or .env file.");
  }

  const prompt = `
Please build my Personal AI System based on the following profile:

- Top Goals (3-6 months): ${profile.user_goals}
- Current AI/Tools and Pain Points: ${profile.user_tools_and_pains}
- Typical Day/Energy Constraints: ${profile.user_energy_routine}
- Monetization or Output Intent: ${profile.user_output_intent}
- Preferred Style (Checklists, Notion hub, voice, etc.): ${profile.user_preferred_style}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: PASB_SCHEMA,
        temperature: 0.4,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI engine.");
    }

    const data = JSON.parse(response.text) as PASBResponse;

    // Basic validation of the parsed data
    if (!data.system_name || !data.core_workflows || !Array.isArray(data.core_workflows)) {
      throw new Error("AI returned malformed system data.");
    }

    return data;
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your GEMINI_API_KEY.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("API quota exceeded. Try again later or switch to Mock Mode.");
    }
    throw new Error(error.message || "An unexpected error occurred during system generation.");
  }
}
