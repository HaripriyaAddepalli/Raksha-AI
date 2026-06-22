
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { analyzeDigitalScam, DigitalScamAnalyzerOutput } from "@/ai/flows/digital-scam-analyzer-flow";
import { Radar, AlertCircle, CheckCircle2, ShieldX, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

export default function ScamDetector() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DigitalScamAnalyzerOutput | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const output = await analyzeDigitalScam({ communicationContent: content });
      setResult(output);
      toast({ title: "Analysis Complete", description: "The content has been scanned for potential risks." });
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis Failed", description: "There was an error processing your request." });
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setContent("");
    setResult(null);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <div className="space-y-6">
          <header>
            <h1 className="headline text-4xl font-bold mb-2">Scam Detector</h1>
            <p className="text-muted-foreground">
              Paste SMS, WhatsApp messages, or call transcripts to detect digital threats in real-time.
            </p>
          </header>

          <Card className="glass relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Radar className={cn("w-6 h-6 text-primary", loading && "animate-spin")} />
            </div>
            <CardHeader>
              <CardTitle className="headline text-lg">Input Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste the suspicious content here..." 
                className="min-h-[300px] bg-black/20 border-white/10 text-white focus:ring-primary"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 headline h-12 text-lg" 
                  onClick={handleAnalyze}
                  disabled={loading || !content.trim()}
                >
                  {loading ? "Analyzing..." : "Run Intelligence Scan"}
                </Button>
                <Button variant="outline" className="border-white/10 h-12" onClick={clear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Results */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-2xl border-dashed">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Info className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="headline text-xl font-bold">Waiting for Input</h3>
              <p className="text-muted-foreground mt-2">Analysis results will appear here once the scan is complete.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              <Card className="glass animate-pulse">
                <CardContent className="py-12 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="headline font-bold">Decrypting Communication Patterns...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className={cn(
                "glass border-l-4",
                result.riskScore > 70 ? "border-l-destructive" : 
                result.riskScore > 30 ? "border-l-warning" : "border-l-emerald-500"
              )}>
                <CardHeader>
                  <CardTitle className="headline text-xl flex items-center justify-between">
                    Risk Assessment
                    <span className="text-sm font-normal text-muted-foreground italic">Conf: {result.confidencePercentage}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90">
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                         <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * result.riskScore) / 100} 
                            className={cn(
                              result.riskScore > 70 ? "text-destructive" : 
                              result.riskScore > 30 ? "text-warning" : "text-emerald-500"
                            )} 
                         />
                       </svg>
                       <span className="absolute headline text-2xl font-bold">{result.riskScore}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="headline text-2xl font-bold text-white mb-1">{result.scamCategory}</h4>
                      <p className="text-sm text-muted-foreground">Threat Classification: {result.riskScore > 50 ? 'Malicious' : 'Safe'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="headline text-sm font-bold flex items-center gap-2">
                      <ShieldX className="w-4 h-4 text-destructive" /> Red Flags Detected
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {result.redFlagsDetected.map((flag, i) => (
                        <div key={i} className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-2 rounded text-xs text-destructive-foreground">
                          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                          {flag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="headline text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recommended Actions
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {result.recommendedActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-xs text-white">
                          <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-emerald-500" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-white/10 headline text-xs tracking-widest uppercase">
                    Generate Full Investigation Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
