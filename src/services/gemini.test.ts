import { describe, it, expect, vi } from 'vitest';
import { generatePersonalAISystem } from './gemini';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    text: JSON.stringify({
      system_name: 'Test System',
      overview: 'Test Overview',
      core_workflows: [],
      memory_and_review: 'Test Review',
      monetization_or_output_loop: 'Test Loop',
      safeguards: [],
      thirty_day_onramp: 'Test Onramp',
      expansion_notes: 'Test Notes'
    })
  });

  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY'
    }
  };
});

describe('generatePersonalAISystem', () => {
  it('should call Gemini API and return parsed response', async () => {
    // Set mock env var for test
    process.env.GEMINI_API_KEY = 'test-key';

    const profile = {
      user_goals: 'Goal',
      user_tools_and_pains: 'Tools',
      user_energy_routine: 'Routine',
      user_output_intent: 'Intent',
      user_preferred_style: 'Style'
    };

    const result = await generatePersonalAISystem(profile);
    expect(result.system_name).toBe('Test System');
    expect(result.overview).toBe('Test Overview');
  });

  it('should throw error if API key is missing', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const profile = {
      user_goals: 'Goal',
      user_tools_and_pains: 'Tools',
      user_energy_routine: 'Routine',
      user_output_intent: 'Intent',
      user_preferred_style: 'Style'
    };

    await expect(generatePersonalAISystem(profile)).rejects.toThrow('Missing GEMINI_API_KEY');

    process.env.GEMINI_API_KEY = originalKey;
  });
});
