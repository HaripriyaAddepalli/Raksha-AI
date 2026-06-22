
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Search, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Cases Analyzed", value: "12,842", icon: FileText, color: "text-primary" },
  { label: "Active Threats", value: "142", icon: Activity, color: "text-accent" },
  { label: "High Risk Cases", value: "84", icon: AlertTriangle, color: "text-destructive" },
  { label: "Fraud Rings Detected", value: "12", icon: Users, color: "text-warning" },
];

const trendData = [
  { name: '00:00', threats: 40 },
  { name: '04:00', threats: 30 },
  { name: '08:00', threats: 70 },
  { name: '12:00', threats: 90 },
  { name: '16:00', threats: 60 },
  { name: '20:00', threats: 100 },
  { name: '23:59', threats: 80 },
];

const categoryData = [
  { name: 'Scams', value: 45, color: '#2563EB' },
  { name: 'Currency', value: 25, color: '#06b6d4' },
  { name: 'Phishing', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#6366f1' },
];

const recentCases = [
  { id: "CS-8241", type: "Digital Arrest", risk: "Critical", time: "2m ago" },
  { id: "CC-1120", type: "Currency Analysis", risk: "Low", time: "15m ago" },
  { id: "NF-9902", type: "Network Detection", risk: "High", time: "1h ago" },
  { id: "CS-8240", type: "OTP Fraud", risk: "Medium", time: "3h ago" },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 pt-24">
          <div className="h-32 w-full animate-pulse bg-white/5 rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="headline text-4xl font-bold mb-2">Command Center</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Intelligence Network Status: Operational
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="glass">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="headline text-3xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="headline text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Threat Trend Analysis (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #1e293b' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="threats" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="headline text-lg">Case Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-2xl font-bold">100%</span>
                   <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Global</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-bold">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="headline text-lg">Recent Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{c.id}</p>
                        <p className="text-xs text-muted-foreground">{c.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                        c.risk === "Critical" ? "bg-destructive/20 text-destructive" :
                        c.risk === "High" ? "bg-warning/20 text-warning" :
                        c.risk === "Medium" ? "bg-primary/20 text-primary" : "bg-emerald-500/20 text-emerald-500"
                      )}>
                        {c.risk}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">{c.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
            <CardHeader>
              <CardTitle className="headline text-lg">Global Alert System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <ShieldAlert className="w-16 h-16 text-primary relative z-10 animate-bounce" />
                </div>
                <div>
                  <h4 className="headline font-bold text-xl">New Campaign Detected</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    Multiple reports of 'Digital Arrest' scams targeting senior citizens in the National Capital Region.
                  </p>
                </div>
                <button className="bg-primary text-white headline px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-primary/40 transition-all">
                  Launch Counter-Operation
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
