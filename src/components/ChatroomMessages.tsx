import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Crown } from 'lucide-react';
import type { Chatroom } from '../types/auth';
import { addMessageToChatroom, getChatroom } from '../utils/chatroom';

interface ChatroomMessagesProps {
  chatroom: Chatroom;
  userId: string;
  onBack: () => void;
}

export function ChatroomMessages({ chatroom, userId, onBack }: ChatroomMessagesProps) {
  const [message, setMessage] = useState('');
  const [sendAsHost, setSendAsHost] = useState(false);
  const [localChatroom, setLocalChatroom] = useState(chatroom);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHost = chatroom.createdBy === userId;
  const pollInterval = useRef<number>();

  // Update local chatroom when the prop changes
  useEffect(() => {
    setLocalChatroom(chatroom);
  }, [chatroom]);

  // Poll for new messages
  useEffect(() => {
    const pollMessages = () => {
      const updatedChatroom = getChatroom(chatroom.id);
      if (updatedChatroom && updatedChatroom.messages.length !== localChatroom.messages.length) {
        setLocalChatroom(updatedChatroom);
      }
    };

    // Poll every 1 second
    pollInterval.current = window.setInterval(pollMessages, 1000);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [chatroom.id, localChatroom.messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localChatroom.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageContent = sendAsHost ? `[HOST] ${message.trim()}` : message.trim();
      const updatedChatroom = addMessageToChatroom(chatroom.id, userId, messageContent);
      setLocalChatroom(updatedChatroom);
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{localChatroom.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {localChatroom.messages.map((msg) => {
          const isOwnMessage = msg.senderId === userId;
          const isHostMessage = msg.content.startsWith('[HOST]');
          const messageContent = isHostMessage ? msg.content.replace('[HOST] ', '') : msg.content;
          const displayName = isHostMessage ? 'Host' : localChatroom.anonymousNames[msg.senderId];

          return (
            <div
              key={msg.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? isHostMessage 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : isHostMessage
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-gray-900'
                      : 'bg-white text-gray-900'
                }`}
              >
                <p className={`text-xs mb-1 flex items-center gap-1 ${
                  isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {displayName}
                  {isHostMessage && <Crown className="h-3 w-3" />}
                </p>
                <p className="break-words">{messageContent}</p>
                <p className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isHost && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendAsHost"
              checked={sendAsHost}
              onChange={(e) => setSendAsHost(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="sendAsHost" className="text-sm text-gray-700 flex items-center gap-1">
              Send as Host <Crown className="h-4 w-4 text-indigo-600" />
            </label>
          </div>
        )}
        <div className="flex gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              sendAsHost
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}