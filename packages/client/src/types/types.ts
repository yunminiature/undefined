export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  phone: string;
  login: string;
  avatar: string | null;
  email: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  commentsCount: number;
}

export interface Comment {
  id: string;
  topicId: string;
  content: string;
  author: string;
  createdAt: string;
}
