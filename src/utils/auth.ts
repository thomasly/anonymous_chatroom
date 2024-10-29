import type { StoredUser, LoginCredentials, RegisterCredentials, User } from '../types/auth';

const USERS_STORAGE_KEY = 'registered_users';

export function getStoredUsers(): StoredUser[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

export function storeUser(user: StoredUser) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function updateUser(updatedUser: StoredUser) {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

export function validateCredentials(credentials: LoginCredentials): StoredUser {
  const users = getStoredUsers();
  const user = users.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.password !== credentials.password) {
    throw new Error('Invalid password');
  }
  
  return user;
}

export function isEmailRegistered(email: string): boolean {
  const users = getStoredUsers();
  return users.some(user => user.email === email);
}

export function getAllUsers(currentUserId: string): User[] {
  const currentUser = getStoredUsers().find(u => u.id === currentUserId);
  if (!currentUser) return [];

  return getStoredUsers()
    .filter(user => user.id !== currentUserId)
    .map(({ password, ...user }) => user);
}

export function toggleFriend(userId: string, friendId: string): void {
  const users = getStoredUsers();
  const currentUser = users.find(u => u.id === userId);
  const friendUser = users.find(u => u.id === friendId);

  if (!currentUser || !friendUser) {
    throw new Error('User not found');
  }

  if (!currentUser.friends) currentUser.friends = [];
  if (!friendUser.friends) friendUser.friends = [];

  const isFriend = currentUser.friends.includes(friendId);

  if (isFriend) {
    // Remove friend
    currentUser.friends = currentUser.friends.filter(id => id !== friendId);
    friendUser.friends = friendUser.friends.filter(id => id !== userId);
  } else {
    // Add friend
    currentUser.friends.push(friendId);
    friendUser.friends.push(userId);
  }

  updateUser(currentUser);
  updateUser(friendUser);
}

export function getFriends(userId: string): User[] {
  const users = getStoredUsers();
  const currentUser = users.find(u => u.id === userId);
  
  if (!currentUser || !currentUser.friends) {
    return [];
  }

  return users
    .filter(user => currentUser.friends.includes(user.id))
    .map(({ password, ...user }) => user);
}