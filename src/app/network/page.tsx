
"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Network, Upload, Share2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen pt-24 bg-background">
        <Navbar />
      </main>
    );
  }

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
            <Button variant="outline" className="glass border-white/10" onClick={handleFileUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Filter className="w-4 h-4 mr-2" />
              Cluster Analysis
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Sidebar controls */}
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
                    Detected automated transfer cycle between 12 distinct shell accounts. Funds consolidating in "Aggregator Node" before off-ramping.
                  </p>
                </div>
                <Button variant="outline" className="w-full text-xs headline py-1 border-white/10">
                   <Share2 className="w-3 h-3 mr-2" /> Export Graph
                </Button>
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

          {/* Flow Visualizer */}
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
