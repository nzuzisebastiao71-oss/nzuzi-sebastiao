export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type RequestStatus = 'Pendente' | 'Em Processo' | 'Concluído' | 'Cancelado';

export interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
  attachments?: string[]; // Base64 or URLs
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  companyId: string;
  lastMaintenance?: string;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
