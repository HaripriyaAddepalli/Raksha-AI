"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const { db } = useFirestore() as any;

  const investigationsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "investigations"),
      orderBy("timestamp", "desc"),
      limit(20)
    );
  }, [db, user]);

  const { data: investigations, loading } = useCollection(investigationsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!investigations) return [
      { label: "Total Cases", value: "0", icon: FileText, color: "text-primary" },
      { label: "Active Threats", value: "0", icon: Activity, color: "text-accent" },
      { label: "High Risk", value: "0", icon: AlertTriangle, color: "text-destructive" },
      { label: "Alerts", value: "0", icon: Users, color: "text-warning" },
    ];

    const total = investigations.length;
    const alerts = investigations.filter(i => i.status === 'Alert').length;
    const highRisk = investigations.filter(i => i.riskScore > 70).length;

    return [
      { label: "Total Cases", value: total.toString(), icon: FileText, color: "text-primary" },
      { label: "High Risk", value: highRisk.toString(), icon: AlertTriangle, color: "text-destructive" },
      { label: "Alerts", value: alerts.toString(), icon: ShieldAlert, color: "text-warning" },
      { label: "Active Tracking", value: total > 0 ? "Active" : "Idle", icon: Activity, color: "text-accent" },
    ];
  }, [investigations]);

  const trendData = useMemo(() => {
    return [
      { name: 'Mon', threats: 40 },
      { name: 'Tue', threats: 30 },
      { name: 'Wed', threats: 70 },
      { name: 'Thu', threats: 90 },
      { name: 'Fri', threats: 60 },
      { name: 'Sat', threats: 100 },
      { name: 'Sun', threats: 80 },
    ];
  }, []);

  const categoryData = useMemo(() => {
    if (!investigations || investigations.length === 0) return [
      { name: 'No Data', value: 100, color: '#334155' }
    ];

    const scam = investigations.filter(i => i.type === 'scam-message').length;
    const currency = investigations.filter(i => i.type === 'counterfeit-currency').length;
    const network = investigations.filter(i => i.type === 'network-analysis').length;

    return [
      { name: 'Scams', value: scam, color: '#2563EB' },
      { name: 'Currency', value: currency, color: '#06b6d4' },
      { name: 'Network', value: network, color: '#f59e0b' },
    ];
  }, [investigations]);

  if (!mounted) return <main className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="headline text-4xl font-bold mb-2">Command Center</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Intelligence Network Status: {loading ? "Syncing..." : "Operational"}
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
          <Card className="glass lg:col-span-2">
            <CardHeader>
              <CardTitle className="headline text-lg">Threat Trend Analysis</CardTitle>
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
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #1e293b' }} />
                    <Area type="monotone" dataKey="threats" stroke="#2563eb" strokeWidth={3} fill="url(#colorThreat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="headline text-lg">Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', border: '1px solid #1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-bold">{cat.value}</span>
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
              <button className="text-xs text-primary hover:underline font-medium">View Archive</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investigations?.slice(0, 4).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground uppercase">{c.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                        c.status === "Alert" ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-500"
                      )}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
                {investigations?.length === 0 && (
                  <p className="text-center text-muted-foreground py-10">No recent activity detected.</p>
                )}
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
                <ShieldAlert className="w-16 h-16 text-primary relative z-10 animate-bounce" />
                <div>
                  <h4 className="headline font-bold text-xl">System Standby</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    Monitoring global fraud networks for real-time campaign detection.
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
