export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageContentType = 'text' | 'code' | 'tool_call' | 'tool_result' | 'image' | 'error';

export interface Message {
  id: string;
  workspace_id: string;
  role: MessageRole;
  content: string;
  content_type: MessageContentType;
  is_streaming: boolean;
  created_at: number;
  updated_at: number;
}

export interface SendMessageDto {
  content: string;
}

export interface MessagesPage {
  messages: Message[];
  cursor: string | null;
}
