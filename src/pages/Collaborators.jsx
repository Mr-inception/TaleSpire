import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Search, UserPlus, Trash, Edit } from 'lucide-react';

const Collaborators = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: "Jane Austen",
      email: "jane@example.com",
      role: "Author",
      image: "/images/collaborator1.png",
      stories: ["The Lost Kingdom", "Mystery of the Night"],
      status: "Active"
    },
    {
      id: 2,
      name: "Victor Smith",
      email: "victor@example.com",
      role: "Editor",
      image: "/images/collaborator2.png",
      stories: ["The Lost Kingdom"],
      status: "Active"
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCollaborator = () => {
    // Open add collaborator modal
    console.log('Add collaborator');
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const handleEditCollaborator = (collaborator) => {
    // Open edit collaborator modal
    console.log('Edit collaborator:', collaborator);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Collaborators</h1>
        <Button onClick={handleAddCollaborator}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Collaborator
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search collaborators..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {collaborators.map((collaborator) => (
          <Card key={collaborator.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar
                    src={collaborator.image}
                    alt={collaborator.name}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{collaborator.name}</h3>
                    <p className="text-gray-600">{collaborator.email}</p>
                    <div className="flex items-center mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {collaborator.role}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-500">
                        {collaborator.stories.length} stories
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Stories: {collaborator.stories.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCollaborator(collaborator)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collaborators; 