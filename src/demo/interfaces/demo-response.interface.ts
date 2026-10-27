export interface DemoResponse {
  message: string;
  timestamp: string;
}

export interface NoteResponse {
  title: string;
  content: string;
  receivedAt: string;
}

export interface DatabaseTimeResponse {
  serverTime: string;
}

export interface PasswordHashResponse {
  hash: string;
  matches: boolean;
}
