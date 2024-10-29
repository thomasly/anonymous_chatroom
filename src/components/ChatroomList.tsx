import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Chatroom } from '../types/auth';
import { ChatroomMessages } from './ChatroomMessages';

interface ChatroomListProps {
  chatrooms: Chatroom[];
  userId: string;
}

export function ChatroomList({ chatrooms, userId }: ChatroomListProps) {
  const [selectedChatroom, setSelectedChatroom] = React.useState<Chatroom | null>(null);

  if (selectedChatroom) {
    return (
      <ChatroomMessages
        chatroom={selectedChatroom}
        userId={userId}
        onBack={() => setSelectedChatroom(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <MessageSquare className="h-6 w-6 mr-2" />
        Your Chatrooms ({chatrooms.length})
      </h2>

      {chatrooms.length === 0 ? (
        <p className="text-gray-600">You haven't joined any chatrooms yet.</p>
      ) : (
        <div className="space-y-4">
          {chatrooms.map((chatroom) => (
            <button
              key={chatroom.id}
              onClick={() => setSelectedChatroom(chatroom)}
              className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="font-medium text-gray-900">{chatroom.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {chatroom.participants.length} participants
              </p>
              {chatroom.messages.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Last message: {new Date(chatroom.messages[chatroom.messages.length - 1].timestamp).toLocaleString()}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}