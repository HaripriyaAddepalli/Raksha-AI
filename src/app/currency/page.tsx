
"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeCurrency, CounterfeitCurrencyAnalyzerOutput } from "@/ai/flows/counterfeit-currency-analyzer-flow";
import { Shield, Upload, FileImage, Search, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function CurrencyAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CounterfeitCurrencyAnalyzerOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const output = await analyzeCurrency({ currencyImageDataUri: preview });
      setResult(output);
      toast({ title: "Verification Successful", description: "Currency has been analyzed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Scan Failed", description: "Could not process image." });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="headline text-4xl font-bold mb-2">Currency Inspector</h1>
          <p className="text-muted-foreground">
            Upload high-resolution images of banknotes to verify security features and authenticity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Uploader */}
          <Card className="glass flex flex-col">
            <CardHeader>
              <CardTitle className="headline text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Image Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div 
                className={cn(
                  "flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 transition-all relative overflow-hidden",
                  !preview && "hover:border-primary/50 cursor-pointer bg-white/5",
                  preview && "bg-black/40"
                )}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                
                {!preview ? (
                  <>
                    <FileImage className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="headline font-bold text-lg">Click to Upload Banknote</p>
                    <p className="text-xs text-muted-foreground mt-1 text-center">Support: JPG, PNG, WEBP (Max 10MB)</p>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[300px] relative group">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    {loading && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-full h-1 bg-white/10 overflow-hidden relative">
                           <div className="absolute inset-0 bg-primary animate-[move-x_1.5s_infinite]" style={{ width: '30%' }} />
                        </div>
                        <p className="mt-4 headline font-bold animate-pulse">Scanning Security Matrix...</p>
                      </div>
                    )}
                    <button 
                      className="absolute top-2 right-2 p-2 bg-destructive/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-12 headline text-lg" 
                  disabled={!preview || loading}
                  onClick={handleAnalyze}
                >
                  Verify Authenticity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="glass min-h-[400px]">
            <CardHeader>
              <CardTitle className="headline text-lg flex items-center justify-between">
                <span>Intelligence Report</span>
                {result && (
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full uppercase font-bold",
                    result.riskClassification === 'Critical' ? "bg-destructive/20 text-destructive" :
                    result.riskClassification === 'High' ? "bg-warning/20 text-warning" : "bg-emerald-500/20 text-emerald-500"
                  )}>
                    {result.riskClassification} Risk
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               {!result && !loading && (
                 <div className="py-20 flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Upload and verify to see analysis details.</p>
                 </div>
               )}

               {result && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="headline text-4xl font-black text-primary">{result.authenticityScore}%</div>
                       <div className="text-right">
                         <div className="text-xs text-muted-foreground headline uppercase tracking-widest">Confidence Score</div>
                         <div className="text-sm font-bold">Verification Grade: {result.authenticityScore > 90 ? 'A+' : 'Caution'}</div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h5 className="headline text-sm font-bold flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-primary" /> Security Features Check
                       </h5>
                       <div className="grid grid-cols-1 gap-2">
                          {result.securityFeatureCheck.map((feature, i) => (
                            <div key={i} className="flex items-center justify-between text-xs p-2 bg-white/5 rounded">
                               <span>{feature}</span>
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h5 className="headline text-sm font-bold flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4 text-warning" /> Anomalies Identified
                       </h5>
                       <div className="grid grid-cols-1 gap-2">
                          {result.suspiciousRegions.length > 0 ? (
                            result.suspiciousRegions.map((region, i) => (
                              <div key={i} className="text-xs p-2 bg-warning/10 border border-warning/20 rounded text-warning">
                                 {region}
                              </div>
                            ))
                          ) : (
                            <div className="text-xs p-2 bg-emerald-500/10 text-emerald-500 rounded">
                              No suspicious regions detected. Note appears genuine.
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                       <Button variant="outline" className="flex-1 border-white/10 text-xs headline uppercase">Download PDF</Button>
                       <Button className="flex-1 bg-accent hover:bg-accent/90 text-white text-xs headline uppercase">Report Counterfeit</Button>
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
