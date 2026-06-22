
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from "reactflow";
import 'reactflow/dist/style.css';
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Upload, Share2, Filter, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Primary Account #8241' }, style: { border: '2px solid #ef4444', padding: '10px' } },
  { id: '2', position: { x: 0, y: 150 }, data: { label: 'Shell Merchant A' } },
  { id: '3', position: { x: 500, y: 150 }, data: { label: 'Private Wallet B' } },
  { id: '4', position: { x: 250, y: 300 }, data: { label: 'Aggregator Node' }, style: { border: '2px solid #f59e0b' } },
  { id: '5', position: { x: 50, y: 450 }, data: { label: 'Suspicious IP 192.168.1.1' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: '$5,000', animated: true },
  { id: 'e1-3', source: '1', target: '3', label: '$12,400', animated: true },
  { id: 'e2-4', source: '2', target: '4', label: '$4,800' },
  { id: 'e3-4', source: '3', target: '4', label: '$12,000' },
  { id: 'e4-5', source: '4', target: '5', label: 'Redirect' },
];

export default function FraudNetwork() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      // Simple CSV parsing: Source, Target, Amount, Label
      const lines = content.split('\n').slice(1); // skip header
      const newNodes: any[] = [];
      const newEdges: any[] = [];
      const nodeSet = new Set();

      lines.forEach((line, index) => {
        const [source, target, amount, label] = line.split(',').map(s => s?.trim());
        if (!source || !target) return;

        if (!nodeSet.has(source)) {
          newNodes.push({
            id: source,
            position: { x: Math.random() * 500, y: index * 100 },
            data: { label: source },
            style: { border: '2px solid #2563eb' }
          });
          nodeSet.add(source);
        }
        if (!nodeSet.has(target)) {
          newNodes.push({
            id: target,
            position: { x: Math.random() * 500, y: index * 100 + 50 },
            data: { label: target },
            style: { border: '2px solid #64748b' }
          });
          nodeSet.add(target);
        }

        newEdges.push({
          id: `e-${source}-${target}-${index}`,
          source,
          target,
          label: amount || label || '',
          animated: true
        });
      });

      if (newNodes.length > 0) {
        setNodes(newNodes);
        setEdges(newEdges);
        toast({ title: "Analysis Complete", description: `Mapped ${newNodes.length} nodes and ${newEdges.length} connections.` });
      } else {
        toast({ variant: "destructive", title: "Parsing Error", description: "CSV format invalid. Expected: Source, Target, Amount, Label" });
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not read CSV file." });
    };
    reader.readAsText(file);
  };

  const handleDemoMode = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsProcessing(false);
      toast({ title: "Demo Mode Active", description: "Loaded known fraud ring pattern." });
    }, 1500);
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="headline text-4xl font-bold mb-2">Network Intelligence</h1>
            <p className="text-muted-foreground">
              Mapping transaction relationships and identifying illicit fraud clusters.
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileUpload} 
            />
            <Button variant="outline" className="glass border-white/10" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleDemoMode}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Demo Ring
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="headline text-sm font-bold">Investigation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Case ID</p>
                   <p className="font-bold text-sm">FR-2026-ALPHA</p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                   <p className="text-[10px] text-destructive uppercase tracking-widest font-bold">Threat Level</p>
                   <p className="font-bold text-sm text-destructive">Critical - Fraud Ring Active</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase text-muted-foreground">Summary</h5>
                  <p className="text-xs leading-relaxed">
                    Detected automated transfer cycle between multiple accounts. Funds consolidating in "Aggregator Node" before off-ramping to high-risk IPs.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="headline text-sm font-bold">Active Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-3">
                    {[
                      { label: "Smurfing Patterns", value: "High", color: "text-destructive" },
                      { label: "IP Velocity", value: "Normal", color: "text-emerald-500" },
                      { label: "KYC Mismatch", value: "Flagged", color: "text-warning" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={cn("font-bold", item.color)}>{item.value}</span>
                      </div>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass lg:col-span-3 h-[600px] overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
               <div className="px-3 py-1 bg-card/80 border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-bold headline">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 REAL-TIME MAPPING
               </div>
            </div>
            
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              theme="dark"
            >
              <Background color="#1e293b" gap={20} />
              <Controls className="!bg-card !border-white/10 fill-white" />
              <MiniMap 
                nodeColor={(node) => {
                  if (node.id === '1') return '#ef4444';
                  if (node.id === '4') return '#f59e0b';
                  return '#2563eb';
                }}
                maskColor="rgba(11, 18, 32, 0.7)"
                className="!bg-card !border-white/10"
              />
            </ReactFlow>

            {isProcessing && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                 <div className="w-24 h-24 relative mb-6">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <Network className="absolute inset-0 m-auto w-10 h-10 text-primary" />
                 </div>
                 <h3 className="headline text-2xl font-bold">Processing Big Data</h3>
                 <p className="text-muted-foreground mt-2">Reconstructing transaction graphs from dataset...</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
