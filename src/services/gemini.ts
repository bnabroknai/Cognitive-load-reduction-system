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
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate system");
  }

  return response.json();
}
