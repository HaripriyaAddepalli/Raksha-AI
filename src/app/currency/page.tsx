"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeCurrency, CounterfeitCurrencyAnalyzerOutput } from "@/ai/flows/counterfeit-currency-analyzer-flow";
import { Shield, Upload, FileImage, Search, CheckCircle2, AlertTriangle, XCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CurrencyAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CounterfeitCurrencyAnalyzerOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const { db } = useFirestore() as any;
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const saveInvestigation = (res: CounterfeitCurrencyAnalyzerOutput) => {
    if (!user || !db) return;

    const invRef = doc(collection(db, "users", user.uid, "investigations"));
    setDoc(invRef, {
      userId: user.uid,
      type: "counterfeit-currency",
      title: `Currency Scan: ${res.riskClassification} Risk`,
      timestamp: new Date().toISOString(),
      riskScore: 100 - res.authenticityScore,
      status: res.riskClassification === 'Critical' ? "Alert" : "Completed",
      details: JSON.stringify(res),
      createdAt: serverTimestamp(),
    }).catch(err => console.error("Error saving investigation:", err));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 5MB." });
        return;
      }
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setResult(null);
    }
  };

  const handleAnalyze = async (isDemo = false) => {
    if (!preview && !isDemo) return;
    setLoading(true);
    setResult(null);

    try {
      let output: CounterfeitCurrencyAnalyzerOutput;
      if (isDemo) {
        await new Promise(r => setTimeout(r, 2000));
        output = {
          authenticityScore: 12,
          suspiciousRegions: ["Blurred watermark", "Inconsistent font", "Missing color-shifting ink"],
          securityFeatureCheck: ["Watermark: Missing", "Thread: Surface printed", "Ink: Static"],
          riskClassification: 'Critical'
        };
        toast({ title: "Demo Mode Active", description: "Showing simulated results." });
      } else {
        output = await analyzeCurrency({ currencyImageDataUri: preview! });
        toast({ title: "Verification Successful", description: "Analysis complete." });
      }
      setResult(output);
      saveInvestigation(output);
    } catch (error) {
      console.error("Currency analysis error:", error);
      toast({ variant: "destructive", title: "Error", description: "Analysis failed. Please try again or use demo mode." });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="headline text-4xl font-bold mb-2">Currency Inspector</h1>
          <p className="text-muted-foreground">Upload banknote images to verify security features.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass flex flex-col">
            <CardHeader>
              <CardTitle className="headline text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> Image Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div 
                className={cn(
                  "flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden",
                  !preview && "hover:border-primary/50 cursor-pointer bg-white/5",
                  preview && "bg-black/40"
                )}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {!preview ? (
                  <>
                    <FileImage className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="headline font-bold text-lg">Click to Upload</p>
                    <p className="text-xs text-muted-foreground mt-2">Maximum size: 5MB</p>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[300px] relative group">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    {loading && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-full h-1 bg-white/10 overflow-hidden relative">
                           <div className="absolute inset-0 bg-primary animate-move-x" style={{ width: '30%' }} />
                        </div>
                        <p className="mt-4 headline font-bold">Scanning Matrix...</p>
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-destructive/80 text-white rounded-full z-10" onClick={(e) => { e.stopPropagation(); reset(); }}>
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full h-12 headline" disabled={!preview || loading} onClick={() => handleAnalyze(false)}>
                  Verify Authenticity
                </Button>
                <Button variant="secondary" className="w-full h-10 headline" onClick={() => handleAnalyze(true)} disabled={loading}>
                  <PlayCircle className="w-4 h-4 mr-2" /> Try with Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass min-h-[400px]">
            <CardHeader>
              <CardTitle className="headline text-lg flex items-center justify-between">
                <span>Intelligence Report</span>
                {result && (
                  <Badge variant={result.riskClassification === 'Critical' ? 'destructive' : 'default'}>
                    {result.riskClassification} Risk
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               {!result && !loading && (
                 <div className="py-20 flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Upload and verify to see analysis.</p>
                 </div>
               )}
               {result && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="headline text-4xl font-black text-primary">{result.authenticityScore}%</div>
                       <div className="text-right">
                         <div className="text-xs text-muted-foreground headline uppercase">Confidence Score</div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h5 className="headline text-sm font-bold flex items-center gap-2">Security Features</h5>
                       <div className="grid grid-cols-1 gap-2">
                          {result.securityFeatureCheck.map((feature, i) => (
                            <div key={i} className="text-xs p-2 bg-white/5 rounded flex justify-between items-center">
                               <span>{feature}</span>
                               <CheckCircle2 className={cn("w-4 h-4 shrink-0 ml-2", (feature.toLowerCase().includes('missing') || feature.toLowerCase().includes('fake') || feature.toLowerCase().includes('incorrect')) ? "text-destructive" : "text-emerald-500")} />
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h5 className="headline text-sm font-bold flex items-center gap-2">Suspicious Regions</h5>
                       <div className="grid grid-cols-1 gap-2">
                          {result.suspiciousRegions.map((region, i) => (
                            <div key={i} className="text-xs p-2 bg-destructive/10 border border-destructive/20 rounded flex items-center gap-2">
                               <AlertTriangle className="w-3 h-3 text-destructive" />
                               <span>{region}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
