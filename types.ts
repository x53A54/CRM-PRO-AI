
export enum LeadStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
  LOST = 'Lost'
}

export enum LeadPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum UserRole {
  OWNER = 'OWNER',
  SALES = 'SALES'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

export interface Activity {
  id: string;
  type: 'note' | 'status_change' | 'call' | 'email' | 'task';
  content: string;
  timestamp: string;
  user: string;
}

export interface Task {
  id: string;
  leadId?: string;
  leadName?: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
  priority: LeadPriority;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  followUpDate?: string;
  value: number;
  lossReason?: string;
  activities: Activity[];
}

export interface Suggestion {
  title: string;
  description: string;
  type: 'immediate' | 'nurture' | 'escalation' | 'retention';
}

export interface UserStats {
  totalLeads: number;
  attended: number;
  overdue: number;
  lost: number;
  successRate: number;
}
