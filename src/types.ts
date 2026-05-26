export interface User {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
