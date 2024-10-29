import React from 'react';
import { UserPlus } from 'lucide-react';
import type { User } from '../types/auth';

interface UserListProps {
  users: User[];
  currentUser: User;
  onToggleFriend: (userId: string) => void;
}

export function UserList({ users, currentUser, onToggleFriend }: UserListProps) {
  // Filter out users who are already friends
  const nonFriendUsers = users.filter(user => !currentUser.friends.includes(user.id));

  if (nonFriendUsers.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">
        No new users to add as friends
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {nonFriendUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => onToggleFriend(user.id)}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="h-5 w-5 mr-1" />
            Add Friend
          </button>
        </div>
      ))}
    </div>
  );
}