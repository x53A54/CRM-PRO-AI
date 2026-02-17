
import { Lead, LeadStatus, LeadPriority, Task, TaskStatus } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 555-0101',
    status: LeadStatus.NEW,
    priority: LeadPriority.URGENT,
    owner: 'Alex Rivera',
    source: 'Website Form',
    createdAt: '2024-05-15T09:00:00Z',
    lastActivity: '2024-05-15T09:00:00Z',
    followUpDate: '2024-05-15T11:00:00Z',
    value: 2500,
    activities: [
      { id: 'a1', type: 'status_change', content: 'Lead created via Website Form', timestamp: '2024-05-15T09:00:00Z', user: 'System' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@techcorp.io',
    phone: '+1 555-0102',
    status: LeadStatus.IN_PROGRESS,
    priority: LeadPriority.HIGH,
    owner: 'Jordan Smith',
    source: 'LinkedIn',
    createdAt: '2024-05-14T14:30:00Z',
    lastActivity: '2024-05-15T10:15:00Z',
    followUpDate: '2024-05-14T16:00:00Z',
    value: 5000,
    activities: [
      { id: 'a2', type: 'note', content: 'Customer interested in annual package.', timestamp: '2024-05-15T10:15:00Z', user: 'Jordan Smith' }
    ]
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@designhub.com',
    phone: '+1 555-0103',
    status: LeadStatus.CLOSED,
    priority: LeadPriority.MEDIUM,
    owner: 'Alex Rivera',
    source: 'Referral',
    createdAt: '2024-05-10T11:00:00Z',
    lastActivity: '2024-05-13T15:00:00Z',
    value: 1200,
    activities: [
      { id: 'a3', type: 'status_change', content: 'Closed deal - Paid in full', timestamp: '2024-05-13T15:00:00Z', user: 'Alex Rivera' }
    ]
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.w@global.net',
    phone: '+1 555-0104',
    status: LeadStatus.LOST,
    priority: LeadPriority.LOW,
    owner: 'Jordan Smith',
    source: 'Google Ads',
    createdAt: '2024-05-08T10:00:00Z',
    lastActivity: '2024-05-12T09:00:00Z',
    lossReason: 'Price too high',
    value: 3000,
    activities: [
      { id: 'a4', type: 'status_change', content: 'Lost: Pricing concerns', timestamp: '2024-05-12T09:00:00Z', user: 'Jordan Smith' }
    ]
  },
  {
    id: '5',
    name: 'Samantha Blair',
    email: 'sam@fashion.co',
    phone: '+1 555-0105',
    status: LeadStatus.IN_PROGRESS,
    priority: LeadPriority.HIGH,
    owner: 'Alex Rivera',
    source: 'Instagram',
    createdAt: '2024-05-15T08:00:00Z',
    lastActivity: '2024-05-15T12:00:00Z',
    followUpDate: '2024-05-16T10:00:00Z',
    value: 4500,
    activities: [
      { id: 'a5', type: 'call', content: 'Initial discovery call successful', timestamp: '2024-05-15T12:00:00Z', user: 'Alex Rivera' }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    leadId: '1',
    leadName: 'Sarah Jenkins',
    title: 'Review proposal requirements',
    description: 'Sarah requested a detailed breakdown of service fees.',
    assignedTo: 'Alex Rivera',
    dueDate: '2024-05-20T17:00:00Z',
    status: TaskStatus.PENDING,
    priority: LeadPriority.URGENT
  },
  {
    id: 't2',
    leadId: '2',
    leadName: 'Michael Chen',
    title: 'Call to discuss pricing',
    description: 'Address concerns about the implementation timeline.',
    assignedTo: 'Jordan Smith',
    dueDate: '2024-05-14T10:00:00Z',
    status: TaskStatus.OVERDUE,
    priority: LeadPriority.HIGH
  }
];
