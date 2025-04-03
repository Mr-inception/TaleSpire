import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const CollaboratorManager = ({ storyId, onClose }) => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchCollaborators();
  }, [storyId]);

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stories/${storyId}/collaborators`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setError('Failed to load collaborators');
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories/${storyId}/collaborators`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEmail('');
      fetchCollaborators();
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setError(error.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/stories/${storyId}/collaborators/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      setError('Failed to remove collaborator');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manage Collaborators</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCollaborator} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="space-y-4">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator._id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <Avatar
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  fallback={collaborator.name[0]}
                />
                <div>
                  <div className="font-medium">{collaborator.name}</div>
                  <div className="text-sm text-gray-500">{collaborator.email}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCollaborator(collaborator._id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaboratorManager; 