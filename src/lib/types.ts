
export type CaseStatus = 'Pending' | 'Analyzing' | 'Completed' | 'Alert';

export interface Case {
  id: string;
  type: 'Scam' | 'Currency' | 'Network';
  title: string;
  timestamp: string;
  riskScore: number;
  status: CaseStatus;
  summary?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'Account' | 'Merchant' | 'Risk';
  risk: 'Low' | 'Medium' | 'High';
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
}
