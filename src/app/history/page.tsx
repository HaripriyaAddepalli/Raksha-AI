"use client";

import { useState, useEffect, useMemo } from "react";
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
  Download, 
  ExternalLink, 
  ShieldAlert, 
  FileText, 
  Network,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function ActivityHistory() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const { db } = useFirestore() as any;

  const investigationsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "investigations"),
      orderBy("timestamp", "desc")
    );
  }, [db, user]);

  const { data: investigations, loading } = useCollection(investigationsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="min-h-screen pt-24 bg-background" />;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="headline text-4xl font-bold mb-2">Investigation History</h1>
            <p className="text-muted-foreground">Comprehensive audit trail of all operations.</p>
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
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Timestamp</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Module</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Subject</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold text-center">Risk Vector</TableHead>
                  <TableHead className="headline text-xs text-white uppercase tracking-widest font-bold">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investigations?.map((item: any) => (
                  <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         {item.type === 'scam-message' && <ShieldAlert className="w-4 h-4 text-accent" />}
                         {item.type === 'counterfeit-currency' && <FileText className="w-4 h-4 text-emerald-500" />}
                         {item.type === 'network-analysis' && <Network className="w-4 h-4 text-warning" />}
                         <span className="text-sm capitalize">{item.type.replace('-', ' ')}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{item.title}</TableCell>
                    <TableCell className="text-center">
                       <Badge variant={item.riskScore > 70 ? 'destructive' : 'default'}>
                         Score: {item.riskScore}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-medium">{item.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                           <Download className="w-4 h-4" />
                         </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && investigations?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      No investigation records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
