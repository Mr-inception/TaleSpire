import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Trash, Edit } from 'lucide-react';

const MyStories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stories, setStories] = useState([
    {
      id: 1,
      title: "The Lost Kingdom",
      description: "Once, in the heart of a forgotten land, there thrived a kingdom called Eryndor...",
      image: "/images/story1.png",
      lastModified: "2024-02-20",
      collaborators: 2
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  const handleEditStory = (story) => {
    // Navigate to story editor
    console.log('Edit story:', story);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Stories</h1>
        <Button>Create New Story</Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <p className="text-gray-600 mb-4">{story.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Last modified: {story.lastModified}</span>
                    <span className="mx-2">•</span>
                    <span>{story.collaborators} collaborators</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStory(story)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStory(story.id)}
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

export default MyStories; 