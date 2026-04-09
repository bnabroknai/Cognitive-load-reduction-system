import { PASBResponse } from './gemini';

export const MOCK_SYSTEM_DATA: PASBResponse = {
  system_name: "The Clarity Engine (MOCK)",
  overview: "A streamlined daily operating system designed to eliminate choice paralysis and focus your energy on high-leverage creative work.",
  core_workflows: [
    {
      name: "Morning Cognitive Load Sweep",
      trigger: "08:00 AM - Before opening email",
      tools_used: "Notion + Claude",
      exact_prompts_or_steps: "1. Open Notion 'Inbox'.\n2. Dump all tasks from head.\n3. Paste list into Claude: 'Categorize these by energy required: High, Low, or Delegate.'",
      automation_ideas: "Use a Zapier hook to send voice notes from phone directly to Notion Inbox.",
      expected_time: "10 mins"
    },
    {
      name: "Deep Work Deep Dive",
      trigger: "09:00 AM - 11:30 AM",
      tools_used: "Forest App + Focused Browser",
      exact_prompts_or_steps: "1. Select top 'High Energy' task from sweep.\n2. Set timer for 90 mins.\n3. Zero notifications allowed.",
      automation_ideas: "Mac Shortcuts to close all non-essential apps when 'Deep Work' mode is activated.",
      expected_time: "2.5 hours"
    },
    {
      name: "Evening Context Preservation",
      trigger: "05:00 PM - End of workday",
      tools_used: "Notion",
      exact_prompts_or_steps: "1. Record 'Where I left off' for active projects.\n2. Note 'First step for tomorrow'.\n3. Clear physical desk.",
      automation_ideas: "Auto-generate a daily recap page in Notion for review.",
      expected_time: "15 mins"
    }
  ],
  memory_and_review: "Every Sunday at 4pm, review the 'Context Preservation' notes. Move unfinished high-energy tasks to the top of next week's queue. Archive completed work to keep the active dashboard clean.",
  monetization_or_output_loop: "Your system is designed to produce 2 high-quality newsletter drafts per week. By protecting the morning deep work slot, you ensure the core product is built before cognitive fatigue sets in.",
  safeguards: [
    "If Claude suggests more than 5 tasks for a day, ruthlessly delete the bottom 2.",
    "No AI brainstorming after 8 PM - protects sleep quality.",
    "Verify all AI-generated code snippets manually before deployment."
  ],
  thirty_day_onramp: "Week 1: Only the Morning Sweep.\nWeek 2: Add Deep Work blocks.\nWeek 3: Full system implementation with Evening Preservation.\nWeek 4: First Sunday review.",
  expansion_notes: "Once comfortable, consider adding a custom GPT trained on your specific writing style to speed up newsletter drafting."
};
