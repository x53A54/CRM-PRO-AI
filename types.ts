export enum LeadStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
  LOST = 'lost'
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum LeadStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export enum UserRole {
  ADMIN = 'admin',
  EXECUTIVE = 'executive'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

export interface Activity {
  id: string;
  type: 'note' | 'status_change' | 'call' | 'email' | 'task' | 'system';
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
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  stage?: LeadStage;
  priority: LeadPriority;
  assignedTo?: string;
  createdAt?: string;
  followUpDate?: string;
  value?: number;
  activities?: Activity[];
}
