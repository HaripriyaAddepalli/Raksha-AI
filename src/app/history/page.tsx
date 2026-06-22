
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  History, 
  Download, 
  ExternalLink, 
  ShieldAlert, 
  FileText, 
  Network,
  MoreVertical,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockHistory = [
  { id: "RK-8241", date: "2026-03-15 14:32", type: "Scam Scan", target: "SMS Transcript", risk: "Critical", status: "Reported" },
  { id: "RK-8239", date: "2026-03-15 12:10", type: "Currency", target: "500 INR Banknote", risk: "Low", status: "Verified" },
  { id: "RK-8211", date: "2026-03-14 18:45", type: "Network", target: "TX-990-Dataset", risk: "High", status: "Alert Sent" },
  { id: "RK-8192", date: "2026-03-14 09:20", type: "Scam Scan", target: "WhatsApp Msg", risk: "Medium", status: "Flagged" },
  { id: "RK-8150", date: "2026-03-13 16:11", type: "Currency", target: "100 USD Banknote", risk: "Critical", status: "Seized" },
];

export default function ActivityHistory() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="headline text-4xl font-bold mb-2">Investigation History</h1>
            <p className="text-muted-foreground">Comprehensive audit trail of all safety intelligence operations.</p>
          </div>
          <Button variant="outline" className="glass border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
          </Button>
        </header>

        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Investigation ID</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Timestamp</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Module</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Subject</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold text-center">Risk Vector</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item) => (
                  <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-mono text-sm font-bold text-primary">{item.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         {item.type === 'Scam Scan' && <ShieldAlert className="w-4 h-4 text-accent" />}
                         {item.type === 'Currency' && <FileText className="w-4 h-4 text-emerald-500" />}
                         {item.type === 'Network' && <Network className="w-4 h-4 text-warning" />}
                         <span className="text-sm">{item.type}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{item.target}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={cn(
                         "text-[10px] font-bold uppercase",
                         item.risk === 'Critical' ? "bg-destructive/20 text-destructive border-destructive/20" :
                         item.risk === 'High' ? "bg-warning/20 text-warning border-warning/20" :
                         item.risk === 'Medium' ? "bg-primary/20 text-primary border-primary/20" :
                         "bg-emerald-500/20 text-emerald-500 border-emerald-500/20"
                       )}>
                         {item.risk}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-medium">{item.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 text-primary">
                           <Download className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                           <ExternalLink className="w-4 h-4" />
                         </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
           <p>Showing 5 of 1,242 historical records</p>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" className="h-8 glass border-white/10" disabled>Previous</Button>
             <Button variant="outline" size="sm" className="h-8 glass border-white/10">Next</Button>
           </div>
        </div>
      </div>
    </main>
  );
}
