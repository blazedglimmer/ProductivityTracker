'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Search,
  UserPlus,
  MessageSquare,
  Clock,
  BarChart3,
} from 'lucide-react';
import { ChatDialog } from '@/components/chat-dialog';
import { FriendActivityDialog } from '@/components/friend-activity-dialog';

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriendForActivity, setSelectedFriendForActivity] =
    useState<User | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadFriends();
      loadPendingRequests();
    }
  }, [session?.user?.id]);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/friends');
      if (!response.ok) toast('Failed to load friends');
      const data = await response.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/friends/requests');
      if (!response.ok) throw toast('Failed to load pending requests');
      const data = await response.json();
      setPendingRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/search?q=${searchQuery}`);
      if (!response.ok) toast.error('Failed to search users');
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to search users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresseeId: userId }),
      });

      if (!response.ok) throw toast.error('Failed to send friend request');

      toast.success('Friend request sent');
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to send friend request:', error);
      toast.error('Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: accept ? 'ACCEPTED' : 'REJECTED' }),
      });

      if (!response.ok) toast.error('Failed to handle friend request');

      toast.success(
        accept ? 'Friend request accepted' : 'Friend request rejected'
      );
      await Promise.all([loadFriends(), loadPendingRequests()]);
    } catch (error) {
      console.error('Failed to handle friend request:', error);
      toast.error('Failed to handle friend request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        Please sign in to access the friends feature
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="search">Find Friends</TabsTrigger>
            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Friends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-4">
                    Loading...
                  </div>
                ) : friends.length > 0 ? (
                  friends.map(friend => (
                    <div
                      key={friend.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-accent/50 gap-4"
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
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFriendForActivity(friend);
                          }}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-4">
                    {`You haven't added any friends yet`}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Search users by username..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  disabled={isLoading}
                  className="w-full"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-4">
                    Loading...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-accent/50 gap-4"
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
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : searchQuery ? (
                  <p className="text-muted-foreground col-span-full text-center py-4">
                    No users found
                  </p>
                ) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Requests</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-4">
                    Loading...
                  </div>
                ) : pendingRequests.length > 0 ? (
                  pendingRequests.map(request => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-accent/50 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {request.requester.name
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.requester.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{request.requester.username}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => handleFriendRequest(request.id, true)}
                          disabled={isLoading}
                          className="flex-1 sm:flex-none"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFriendRequest(request.id, false)}
                          disabled={isLoading}
                          className="flex-1 sm:flex-none"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-4">
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
      {selectedFriendForActivity && (
        <FriendActivityDialog
          friend={selectedFriendForActivity}
          isOpen={!!selectedFriendForActivity}
          onClose={() => setSelectedFriendForActivity(null)}
        />
      )}
    </div>
  );
}
