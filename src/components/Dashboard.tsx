import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, X, MessageSquarePlus } from 'lucide-react';
import { getFriends, getAllUsers } from '../utils/auth';
import { getUserChatrooms } from '../utils/chatroom';
import type { User, Chatroom } from '../types/auth';
import { CreateChatroomModal } from './CreateChatroomModal';
import { ChatroomList } from './ChatroomList';
import { UserList } from './UserList';

export function Dashboard() {
  const { user, logout, error, clearError, toggleFriend } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [isCreateChatroomOpen, setIsCreateChatroomOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (user) {
      setFriends(getFriends(user.id));
      setAllUsers(getAllUsers(user.id));
      setChatrooms(getUserChatrooms(user.id));
    }
  }, [user]);

  const handleToggleFriend = async (friendId: string) => {
    if (!user) return;
    try {
      await toggleFriend(friendId);
      // Update both friends list and all users list
      setFriends(getFriends(user.id));
      setAllUsers(getAllUsers(user.id));
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleChatroomCreated = (newChatroom: Chatroom) => {
    setChatrooms(prev => [...prev, newChatroom]);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-2">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* User Discovery and Friends Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  {showUserList ? 'Find New Friends' : `Friends (${friends.length})`}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUserList(!showUserList)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {showUserList ? 'Show Friends' : 'Find Friends'}
                  </button>
                  {!showUserList && (
                    <button
                      onClick={() => setIsCreateChatroomOpen(true)}
                      disabled={friends.length === 0}
                      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageSquarePlus className="h-5 w-5 mr-2" />
                      Create Chatroom
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex justify-between items-center">
                  <p className="text-red-700">{error}</p>
                  <button onClick={clearError} className="text-red-500 hover:text-red-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {showUserList ? (
                <UserList
                  users={allUsers}
                  currentUser={user}
                  onToggleFriend={handleToggleFriend}
                />
              ) : friends.length === 0 ? (
                <p className="text-gray-600">You haven't added any friends yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center p-4 bg-white rounded-lg shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                      <button
                        onClick={() => handleToggleFriend(friend.id)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove Friend
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chatrooms */}
          <ChatroomList chatrooms={chatrooms} userId={user.id} />
        </div>
      </div>

      {isCreateChatroomOpen && (
        <CreateChatroomModal
          friends={friends}
          userId={user.id}
          onClose={() => setIsCreateChatroomOpen(false)}
          onChatroomCreated={handleChatroomCreated}
        />
      )}
    </div>
  );
}