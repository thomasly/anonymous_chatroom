export interface User {
  id: string;
  email: string;
  name: string;
  friends: string[];
  chatrooms: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface Chatroom {
  id: string;
  name: string;
  createdBy: string;
  participants: string[];
  messages: ChatMessage[];
  anonymousNames: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}