import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User, Chatroom } from '../types/auth';
import { createChatroom } from '../utils/chatroom';

interface CreateChatroomModalProps {
  friends: User[];
  userId: string;
  onClose: () => void;
  onChatroomCreated: (chatroom: Chatroom) => void;
}

export function CreateChatroomModal({ 
  friends, 
  userId, 
  onClose, 
  onChatroomCreated 
}: CreateChatroomModalProps) {
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedFriends.length > 0) {
      const chatroom = createChatroom(name, userId, selectedFriends);
      onChatroomCreated(chatroom);
      onClose();
    }
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Anonymous Chatroom</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Chatroom Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Friends to Invite ({selectedFriends.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {friends.map((friend) => (
                <label
                  key={friend.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend.id)}
                    onChange={() => toggleFriend(friend.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">
                      {friend.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {friend.email}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || selectedFriends.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Chatroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}