import { Topic, Comment } from '@/types';

const TOPICS_KEY = 'forum_topics';
const COMMENTS_KEY = 'forum_comments';

export const getTopics = (): Topic[] => {
  try {
    const topics = localStorage.getItem(TOPICS_KEY);
    return topics ? JSON.parse(topics) : [];
  } catch (error) {
    console.error('Error loading topics:', error);
    return [];
  }
};

export const saveTopic = (topic: Omit<Topic, 'id' | 'createdAt' | 'commentsCount'>): Topic => {
  const topics = getTopics();
  const newTopic: Topic = {
    ...topic,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    commentsCount: 0,
  };

  topics.unshift(newTopic);
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  return newTopic;
};

export const getTopicById = (id: string): Topic | null => {
  const topics = getTopics();
  return topics.find((topic) => topic.id === id) || null;
};

export const updateTopicCommentsCount = (topicId: string): void => {
  const topics = getTopics();
  const comments = getCommentsByTopicId(topicId);
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);

  if (topicIndex !== -1) {
    topics[topicIndex].commentsCount = comments.length;
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  }
};

export const getCommentsByTopicId = (topicId: string): Comment[] => {
  try {
    const comments = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = comments ? JSON.parse(comments) : [];
    return allComments.filter((comment) => comment.topicId === topicId);
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
};

export const saveComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
  try {
    const comments = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = comments ? JSON.parse(comments) : [];

    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    allComments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));

    updateTopicCommentsCount(comment.topicId);

    return newComment;
  } catch (error) {
    console.error('Error saving comment:', error);
    throw error;
  }
};

export const initializeSampleData = (): void => {
  const topics = getTopics();
  if (topics.length === 0) {
    const sampleTopics: Topic[] = [
      {
        id: '1',
        title: 'Welcome to the Forum!',
        content: 'This is the first topic on our forum. Here you can discuss various topics and share opinions.',
        author: 'Administrator',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        commentsCount: 2,
      },
      {
        id: '2',
        title: '2048 Game Discussion',
        content: "Let's discuss strategies and records in the 2048 game. What's your best score?",
        author: 'GameMaster',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        commentsCount: 1,
      },
    ];

    const sampleComments: Comment[] = [
      {
        id: '1',
        topicId: '1',
        content: 'Great idea to create a forum! I hope there will be many interesting discussions here.',
        author: 'User1',
        createdAt: new Date(Date.now() - 21600000).toISOString(),
      },
      {
        id: '2',
        topicId: '1',
        content: 'I agree! Forum is a great place for communication.',
        author: 'User2',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: '3',
        topicId: '2',
        content: 'My best score is 4096! How are you doing?',
        author: 'Gamer',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    localStorage.setItem(TOPICS_KEY, JSON.stringify(sampleTopics));
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(sampleComments));
  }
};
