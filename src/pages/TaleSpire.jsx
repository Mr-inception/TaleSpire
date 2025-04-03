import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Plus, Search, BookOpen, Users } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import StoryEditor from '@/components/editor/StoryEditor';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';

const TaleSpire = () => {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchStories();
    }
  }, [user, token]);

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stories`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStory = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedStory(null);
    setShowEditor(true);
  };

  const handleEditStory = (story) => {
    setSelectedStory(story);
    setShowEditor(true);
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Stories</h1>
        <Button onClick={handleCreateStory}>
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading stories...</div>
      ) : filteredStories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-4">Create your first story to get started</p>
            <Button onClick={handleCreateStory}>
              <Plus className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card
              key={story._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleEditStory(story)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={story.author.avatar}
                      alt={story.author.name}
                      fallback={story.author.name[0]}
                    />
                    <div>
                      <div className="text-sm font-medium">{story.author.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(story.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {story.collaborators.length > 0 && (
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{story.collaborators.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showEditor && (
        <StoryEditor
          storyId={selectedStory?._id}
          onClose={() => {
            setShowEditor(false);
            setSelectedStory(null);
            fetchStories();
          }}
        />
      )}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default TaleSpire; 