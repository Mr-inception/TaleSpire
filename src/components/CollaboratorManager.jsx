import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { UserPlus, X } from 'lucide-react';

const CollaboratorManager = ({ storyId, currentCollaborators = [], onAddCollaborator, onRemoveCollaborator }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (email) {
      onAddCollaborator({
        email,
        role,
        status: 'pending'
      });
      setEmail('');
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Collaborators</h3>
      
      <form onSubmit={handleAddCollaborator} className="flex space-x-2 mb-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-2"
        >
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
          <option value="commenter">Commenter</option>
        </select>
        <Button type="submit">
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {currentCollaborators.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8" src={collaborator.image} />
              <div>
                <p className="font-medium">{collaborator.name}</p>
                <p className="text-sm text-gray-500">{collaborator.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCollaborator(collaborator.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CollaboratorManager; 