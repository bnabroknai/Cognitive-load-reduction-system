import { test, mock } from 'node:test';
import assert from 'node:assert';

const mockGenerateContent = mock.fn();

mock.module('@google/genai', {
  namedExports: {
    GoogleGenAI: class {
      models = { generateContent: mockGenerateContent }
    },
    Type: { OBJECT: 'O', STRING: 'S', ARRAY: 'A' }
  }
});

const { generatePersonalAISystem } = await import('./gemini.ts');

test('throws "No response from Gemini" when response.text is missing', async () => {
  mockGenerateContent.mock.mockImplementationOnce(async () => ({}));
  const profile = { user_goals: '', user_tools_and_pains: '', user_energy_routine: '', user_output_intent: '', user_preferred_style: '' };

  await assert.rejects(generatePersonalAISystem(profile), { message: 'No response from Gemini' });
});

test('throws "No response from Gemini" when response.text is empty', async () => {
  mockGenerateContent.mock.mockImplementationOnce(async () => ({ text: '' }));
  const profile = { user_goals: '', user_tools_and_pains: '', user_energy_routine: '', user_output_intent: '', user_preferred_style: '' };

  await assert.rejects(generatePersonalAISystem(profile), { message: 'No response from Gemini' });
});
