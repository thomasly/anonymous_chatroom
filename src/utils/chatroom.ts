import { Chatroom, User } from '../types/auth';
import { getStoredUsers, updateUser } from './auth';

const CHATROOMS_KEY = 'chatrooms';
const ANONYMOUS_ADJECTIVES = [
  'Mysterious', 'Silent', 'Hidden', 'Shadow', 'Secret', 'Masked', 'Invisible',
  'Unknown', 'Phantom', 'Mystic', 'Stealth', 'Enigmatic', 'Cryptic', 'Veiled',
  'Covert', 'Anonymous', 'Ethereal', 'Celestial', 'Astral', 'Nebulous',
  'Cosmic', 'Lunar', 'Solar', 'Stellar', 'Galactic'
];

const ANONYMOUS_NOUNS = [
  'Panda', 'Fox', 'Dragon', 'Wolf', 'Owl', 'Tiger', 'Bear', 'Eagle',
  'Lion', 'Deer', 'Cat', 'Hawk', 'Rabbit', 'Phoenix', 'Snake', 'Dolphin',
  'Raven', 'Falcon', 'Lynx', 'Panther', 'Jaguar', 'Griffin', 'Unicorn',
  'Dragon', 'Phoenix'
];

export function getChatrooms(): Chatroom[] {
  const chatrooms = localStorage.getItem(CHATROOMS_KEY);
  return chatrooms ? JSON.parse(chatrooms) : [];
}

export function getChatroom(chatroomId: string): Chatroom | undefined {
  return getChatrooms().find(c => c.id === chatroomId);
}

export function storeChatroom(chatroom: Chatroom) {
  const chatrooms = getChatrooms();
  chatrooms.push(chatroom);
  localStorage.setItem(CHATROOMS_KEY, JSON.stringify(chatrooms));
}

export function updateChatroom(updatedChatroom: Chatroom) {
  const chatrooms = getChatrooms();
  const index = chatrooms.findIndex(c => c.id === updatedChatroom.id);
  if (index !== -1) {
    chatrooms[index] = updatedChatroom;
    localStorage.setItem(CHATROOMS_KEY, JSON.stringify(chatrooms));
  }
}

function generateUniqueAnonymousName(usedNames: Set<string>): string {
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop if all combinations are used

  while (attempts < maxAttempts) {
    const adjective = ANONYMOUS_ADJECTIVES[Math.floor(Math.random() * ANONYMOUS_ADJECTIVES.length)];
    const noun = ANONYMOUS_NOUNS[Math.floor(Math.random() * ANONYMOUS_NOUNS.length)];
    const name = `${adjective} ${noun}`;

    if (!usedNames.has(name)) {
      return name;
    }
    attempts++;
  }

  // If we couldn't find a unique combination, append a random number
  return `${ANONYMOUS_ADJECTIVES[Math.floor(Math.random() * ANONYMOUS_ADJECTIVES.length)]} ${
    ANONYMOUS_NOUNS[Math.floor(Math.random() * ANONYMOUS_NOUNS.length)]
  } ${Math.floor(Math.random() * 1000)}`;
}

function generateAnonymousNames(participantIds: string[]): Record<string, string> {
  const usedNames = new Set<string>();
  return participantIds.reduce((acc, id) => {
    const anonymousName = generateUniqueAnonymousName(usedNames);
    usedNames.add(anonymousName);
    acc[id] = anonymousName;
    return acc;
  }, {} as Record<string, string>);
}

export function createChatroom(name: string, creatorId: string, participantIds: string[]): Chatroom {
  const allParticipants = [...new Set([creatorId, ...participantIds])];
  const anonymousNames = generateAnonymousNames(allParticipants);

  const chatroom: Chatroom = {
    id: crypto.randomUUID(),
    name,
    createdBy: creatorId,
    participants: allParticipants,
    messages: [],
    anonymousNames,
  };

  // Store chatroom
  storeChatroom(chatroom);

  // Update all participants' user records
  const users = getStoredUsers();
  allParticipants.forEach(participantId => {
    const user = users.find(u => u.id === participantId);
    if (user) {
      if (!user.chatrooms) {
        user.chatrooms = [];
      }
      user.chatrooms.push(chatroom.id);
      updateUser(user);
    }
  });

  return chatroom;
}

export function getUserChatrooms(userId: string): Chatroom[] {
  return getChatrooms().filter(chatroom => 
    chatroom.participants.includes(userId)
  );
}

export function addMessageToChatroom(
  chatroomId: string,
  senderId: string,
  content: string
): Chatroom {
  const chatrooms = getChatrooms();
  const chatroom = chatrooms.find(c => c.id === chatroomId);
  
  if (!chatroom) {
    throw new Error('Chatroom not found');
  }

  if (!chatroom.participants.includes(senderId)) {
    throw new Error('User is not a participant of this chatroom');
  }

  const message = {
    id: crypto.randomUUID(),
    senderId,
    content,
    timestamp: Date.now(),
  };

  chatroom.messages.push(message);
  updateChatroom(chatroom);

  return chatroom;
}