import { motion } from "motion/react";
import { PASBResponse } from "@/services/gemini";
import { 
  Download, 
  RefreshCcw, 
  Workflow,
  Zap,
  Clock,
  TrendingUp,
  ShieldCheck,
  Calendar,
  ArrowRight,
  BookOpen,
  FileText,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface DashboardProps {
  data: PASBResponse;
  onReset: () => void;
}

export function Dashboard({ data, onReset }: DashboardProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const exportMarkdown = () => {
    let markdown = `# ${data.system_name}\n\n`;
    markdown += `## Overview\n${data.overview}\n\n`;
    markdown += `## Core Workflows\n`;
    data.core_workflows.forEach((w, i) => {
      markdown += `### ${i + 1}. ${w.name}\n`;
      markdown += `- **Trigger:** ${w.trigger}\n`;
      markdown += `- **Tools:** ${w.tools_used}\n`;
      markdown += `- **Expected Time:** ${w.expected_time}\n`;
      markdown += `- **Action:**\n\`\`\`\n${w.exact_prompts_or_steps}\n\`\`\`\n\n`;
      markdown += `- **Automation Idea:** ${w.automation_ideas}\n\n`;
    });
    markdown += `## Strategy\n`;
    markdown += `### Memory & Review Ritual\n${data.memory_and_review}\n\n`;
    markdown += `### Monetization Loop\n${data.monetization_or_output_loop}\n\n`;
    markdown += `## System Safeguards\n`;
    data.safeguards.forEach(s => markdown += `- ${s}\n`);
    markdown += `\n## 30-Day Onramp\n${data.thirty_day_onramp}\n\n`;
    markdown += `## Expansion Notes\n${data.expansion_notes}`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.system_name.replace(/\s+/g, "_")}_PASB.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="pb-24">
      <header className="relative overflow-hidden border-b border-border/40 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-3 py-1">
              System Generated
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {data.system_name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {data.overview}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button onClick={() => window.print()} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button onClick={exportMarkdown} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                <FileText className="w-4 h-4" />
                Export Markdown
              </Button>
              <Button onClick={onReset} variant="ghost" className="gap-2 text-muted-foreground">
                <RefreshCcw className="w-4 h-4" />
                Rebuild System
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="workflows" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-card border border-border/50 p-1 h-12">
              <TabsTrigger value="workflows" className="gap-2 px-6">
                <Workflow className="w-4 h-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="strategy" className="gap-2 px-6">
                <TrendingUp className="w-4 h-4" />
                Strategy
              </TabsTrigger>
              <TabsTrigger value="onramp" className="gap-2 px-6">
                <Calendar className="w-4 h-4" />
                30-Day Plan
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.core_workflows.map((workflow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/30 transition-colors bg-card/50">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          Workflow {index + 1}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {workflow.expected_time}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{workflow.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-1">
                        <Zap className="w-3.5 h-3.5 text-yellow-500" />
                        {workflow.trigger}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stack</h4>
                        <p className="text-sm">{workflow.tools_used}</p>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="space-y-2 relative group">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Action</h4>
                          <button
                            onClick={() => handleCopy(workflow.exact_prompts_or_steps, index)}
                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                            title="Copy prompt"
                          >
                            {copied === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <ScrollArea className="h-32 rounded-md border border-border/30 bg-muted/30 p-3">
                          <code className="text-xs leading-relaxed whitespace-pre-wrap">
                            {workflow.exact_prompts_or_steps}
                          </code>
                        </ScrollArea>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Automation</h4>
                        <p className="text-sm text-muted-foreground italic">{workflow.automation_ideas}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Memory & Review Ritual
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {data.memory_and_review}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Monetization Loop
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {data.monetization_or_output_loop}
                  </p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    System Safeguards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.safeguards.map((rule, i) => (
                      <li key={i} className="flex gap-3 items-start p-4 rounded-lg bg-muted/30 border border-border/30">
                        <div className="mt-1 p-1 rounded-full bg-blue-500/10 text-blue-500">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                        <span className="text-sm leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="onramp" className="space-y-8">
            <Card className="border-border/50 bg-card/50 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="p-8 bg-primary/5 border-r border-border/50">
                  <h3 className="text-2xl font-bold mb-4">Adoption Plan</h3>
                  <p className="text-muted-foreground mb-6">
                    A phased approach to ensure long-term sustainability and prevent initial burnout.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
                      <span className="text-sm font-medium">Phase 1: Foundation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
                      <span className="text-sm font-medium">Phase 2: Integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</div>
                      <span className="text-sm font-medium">Phase 3: Optimization</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="prose prose-invert max-w-none">
                    <h4 className="text-xl font-semibold mb-4 text-primary">The 30-Day Roadmap</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {data.thirty_day_onramp}
                    </p>
                    <Separator className="my-8 bg-border/50" />
                    <h4 className="text-xl font-semibold mb-4 text-primary">Expansion Notes</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {data.expansion_notes}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
