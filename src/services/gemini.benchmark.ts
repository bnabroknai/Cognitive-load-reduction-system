import { mock } from 'node:test';

// Mock the @google/genai module
mock.module('@google/genai', {
  namedExports: {
    GoogleGenAI: class {
      constructor() {}
      models = {
        generateContent: async () => {
          // Simulate expensive API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            text: JSON.stringify({
              system_name: "The Clarity Hub",
              overview: "A minimal system to reduce cognitive fatigue.",
              core_workflows: [
                {
                  name: "Morning Alignment",
                  trigger: "8:00 AM",
                  tools_used: "Notion",
                  exact_prompts_or_steps: "Review goals",
                  automation_ideas: "None",
                  expected_time: "15 mins"
                }
              ],
              memory_and_review: "Weekly review on Fridays.",
              monetization_or_output_loop: "Connect to client outreach.",
              safeguards: ["Limit AI use to 2 hours"],
              thirty_day_onramp: "Start with one workflow.",
              expansion_notes: "Add automation later."
            })
          };
        }
      };
    },
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY'
    }
  }
});

// Set dummy API key to avoid errors
process.env.GEMINI_API_KEY = 'dummy-key';

async function runBenchmark() {
  // Use dynamic import to ensure the mock is applied
  const { generatePersonalAISystem } = await import('./gemini.ts');

  const profile = {
    user_goals: "Grow audience",
    user_tools_and_pains: "Too many tools",
    user_energy_routine: "Low energy in morning",
    user_output_intent: "Monetize blog",
    user_preferred_style: "Checklists"
  };

  console.log("Starting benchmark...");

  // First call (cache miss)
  const start1 = performance.now();
  await generatePersonalAISystem(profile);
  const end1 = performance.now();
  console.log(`First call (baseline): ${(end1 - start1).toFixed(2)}ms`);

  // Second call (should be cache hit after optimization)
  const start2 = performance.now();
  await generatePersonalAISystem(profile);
  const end2 = performance.now();
  console.log(`Second call (repeated input): ${(end2 - start2).toFixed(2)}ms`);

  // Third call (different input, should be cache miss)
  const start3 = performance.now();
  await generatePersonalAISystem({ ...profile, user_goals: "Different goal" });
  const end3 = performance.now();
  console.log(`Third call (different input): ${(end3 - start3).toFixed(2)}ms`);
}

runBenchmark().catch(console.error);
