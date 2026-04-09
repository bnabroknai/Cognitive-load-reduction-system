import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Sparkles, Brain, Zap, Target, Layout } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  isLoading: boolean;
}

export interface OnboardingData {
  user_goals: string;
  user_tools_and_pains: string;
  user_energy_routine: string;
  user_output_intent: string;
  user_preferred_style: string;
}

const STEPS = [
  {
    id: "goals",
    title: "Core Objectives",
    description: "What are your top goals for the next 3-6 months?",
    icon: Target,
    placeholder: "e.g., Grow my X audience to 10k, launch a weekly newsletter...",
    field: "user_goals"
  },
  {
    id: "tools",
    title: "Current Stack",
    description: "What AI tools do you use? What are your biggest pain points?",
    icon: Brain,
    placeholder: "e.g., ChatGPT, Claude, Notion. I spend too much time editing...",
    field: "user_tools_and_pains"
  },
  {
    id: "energy",
    title: "Daily Rhythm",
    description: "Describe your typical day and energy constraints.",
    icon: Zap,
    placeholder: "e.g., Work 9-5, only have 1.5 hours in the evening, usually exhausted...",
    field: "user_energy_routine"
  },
  {
    id: "intent",
    title: "Output Intent",
    description: "How do you plan to monetize or use your outputs?",
    icon: Sparkles,
    placeholder: "e.g., Want to get sponsorships, build a personal brand...",
    field: "user_output_intent"
  },
  {
    id: "style",
    title: "Preferred Format",
    description: "How do you want your system delivered?",
    icon: Layout,
    placeholder: "e.g., Notion hub, simple checklists, voice-friendly...",
    field: "user_preferred_style"
  }
];

export function OnboardingWizard({ onComplete, isLoading }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    user_goals: "",
    user_tools_and_pains: "",
    user_energy_routine: "",
    user_output_intent: "",
    user_preferred_style: ""
  });

  const handleNext = () => {
    const currentFieldValue = formData[STEPS[currentStep].field as keyof OnboardingData];
    if (!currentFieldValue || isLoading) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && !isLoading) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateField = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleNext();
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const StepIcon = STEPS[currentStep].icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <StepIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {STEPS[currentStep].title}
              </CardTitle>
              <CardDescription className="text-base">
                {STEPS[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor={STEPS[currentStep].id} className="sr-only">
                  {STEPS[currentStep].title}
                </Label>
                <Textarea
                  id={STEPS[currentStep].id}
                  placeholder={STEPS[currentStep].placeholder}
                  className="min-h-[150px] text-lg resize-none focus-visible:ring-primary/50"
                  value={formData[STEPS[currentStep].field as keyof OnboardingData]}
                  onChange={(e) => updateField(STEPS[currentStep].field as keyof OnboardingData, e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <p className="text-[10px] text-muted-foreground text-right uppercase tracking-wider">
                  Press <kbd className="font-sans px-1 rounded bg-white/10">⌘ + Enter</kbd> to continue
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData[STEPS[currentStep].field as keyof OnboardingData] || isLoading}
                className="gap-2 px-8"
              >
                {currentStep === STEPS.length - 1 ? (
                  isLoading ? "Building System..." : "Generate System"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {currentStep === STEPS.length - 1 && !isLoading && <Sparkles className="w-4 h-4 ml-1" />}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground italic">
          "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one."
        </p>
      </div>
    </div>
  );
}
