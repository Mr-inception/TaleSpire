import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const TextEditor = ({ onBack, storyId = null }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stories/${storyId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTitle(response.data.title);
      setContent(response.data.content);
      calculateWordCount(response.data.content);
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  };

  const calculateWordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    calculateWordCount(newContent);
  };

  const autoSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      const url = storyId
        ? `${import.meta.env.VITE_API_URL}/api/stories/${storyId}`
        : `${import.meta.env.VITE_API_URL}/api/stories`;
      
      const method = storyId ? 'put' : 'post';

      await axios[method](
        url,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving story:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [content, title]);

  const handleSave = async () => {
    await autoSave();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {wordCount} words
          </span>
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title..."
            className="text-2xl font-bold mb-4"
          />
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your story..."
            className="w-full h-[600px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TextEditor; 