import React from 'react';
import { Check, X, Clock, UserCheck, UserX } from 'lucide-react';
import type { FriendInvite, User } from '../types/auth';

interface InvitationsListProps {
  invitations: FriendInvite[];
  users: User[];
  onRespond?: (inviteId: string, accept: boolean) => void;
  showActions?: boolean;
}

export function InvitationsList({ invitations, users, onRespond, showActions = false }: InvitationsListProps) {
  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <UserX className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-4">
      {invitations.map((invite) => (
        <div
          key={invite.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              From: {getUserName(invite.senderId)}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {getStatusIcon(invite.status)}
              {getStatusText(invite.status)}
              • {new Date(invite.timestamp).toLocaleDateString()}
            </p>
          </div>
          {showActions && invite.status === 'pending' && onRespond && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRespond(invite.id, true)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                title="Accept"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => onRespond(invite.id, false)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title="Reject"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      ))}
      {invitations.length === 0 && (
        <p className="text-gray-600 text-center py-4">No invitations to display</p>
      )}
    </div>
  );
}