'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Search, UserPlus, MessageSquare, Clock } from 'lucide-react';
import { ChatDialog } from '@/components/chat-dialog';

interface User {
  id: string;
  username: string;
  name: string;
}

interface FriendRequest {
  id: string;
  requester: User;
  addressee: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export function Friends() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadFriends();
      loadPendingRequests();
    }
  }, [session?.user?.id]);

  const loadFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Failed to load friends:', error);
      toast.error('Failed to load friends');
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
      toast.error('Failed to load pending requests');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`/api/users/search?q=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search users:', error);
      toast.error('Failed to search users');
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresseeId: userId }),
      });

      if (response.ok) {
        toast.success('Friend request sent');
        setSearchResults(prev => prev.filter(user => user.id !== userId));
      } else {
        throw new Error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: accept ? 'ACCEPTED' : 'REJECTED' }),
      });

      if (response.ok) {
        toast.success(
          accept ? 'Friend request accepted' : 'Friend request rejected'
        );
        loadFriends();
        loadPendingRequests();
      } else {
        throw new Error('Failed to handle friend request');
      }
    } catch (error) {
      console.error('Failed to handle friend request:', error);
      toast.error('Failed to handle friend request');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs defaultValue="friends">
          <TabsList className="mb-4">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="search">Find Friends</TabsTrigger>
            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Friends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {friend.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFriend(friend);
                        setShowChat(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {friends?.length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-4">
                    {`You haven't added any friends yet`}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search users by username..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => sendFriendRequest(user.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {request.requester.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.requester.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{request.requester.username}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleFriendRequest(request.id, true)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFriendRequest(request.id, false)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingRequests?.length === 0 && (
                  <p className="text-muted-foreground col-span-2 text-center py-4">
                    No pending friend requests
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {showChat && selectedFriend && (
        <ChatDialog
          friend={selectedFriend}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedFriend(null);
          }}
        />
      )}
    </div>
  );
}
