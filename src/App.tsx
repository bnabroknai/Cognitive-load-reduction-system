/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { OnboardingWizard, OnboardingData } from "@/components/OnboardingWizard";
import { Dashboard } from "@/components/Dashboard";
import { generatePersonalAISystem, PASBResponse } from "@/services/gemini";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"onboarding" | "dashboard">("onboarding");
  const [isLoading, setIsLoading] = useState(false);
  const [systemData, setSystemData] = useState<PASBResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteOnboarding = async (data: OnboardingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePersonalAISystem(data);
      setSystemData(result);
      setView("dashboard");
    } catch (err) {
      console.error("Failed to generate system:", err);
      setError("Something went wrong while building your system. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView("onboarding");
    setSystemData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-lg">PASB <span className="text-muted-foreground font-normal">v1.0</span></span>
          </div>
          {view === "dashboard" && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              New System
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === "onboarding" ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="pt-12 pb-6 text-center px-4">
                <h2 className="text-4xl font-extrabold tracking-tight mb-3">
                  Cognitive Load Reduction Engine
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                  Convert your chaotic AI stack into a minimal, sustainable daily OS.
                </p>
                {error && (
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg max-w-md mx-auto text-sm">
                    {error}
                  </div>
                )}
              </div>
              <OnboardingWizard onComplete={handleCompleteOnboarding} isLoading={isLoading} />
            </motion.div>
          ) : (
            systemData && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Dashboard data={systemData} onReset={handleReset} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Built for the 2026 Agentic Landscape. Prioritize clarity over complexity.
          </p>
        </div>
      </footer>
    </div>
  );
}
