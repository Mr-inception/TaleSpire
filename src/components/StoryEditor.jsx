import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Save, Share, Users } from 'lucide-react';

const StoryEditor = ({ storyId, initialContent = '', collaborators = [] }) => {
  const [doc] = useState(() => new Y.Doc());
  const [wsProvider] = useState(() => {
    return new WebsocketProvider(
      'ws://localhost:1234',
      storyId,
      doc
    );
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: doc,
        field: 'content',
      }),
    ],
    content: initialContent,
  });

  useEffect(() => {
    return () => {
      wsProvider.destroy();
    };
  }, [wsProvider]);

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving story...');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">Story Editor</h2>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{collaborators.length} collaborators</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Card className="h-full">
          <EditorContent editor={editor} className="prose max-w-none p-4" />
        </Card>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-1">
              <Avatar className="h-6 w-6" src={collaborator.image} />
              <span className="text-sm">{collaborator.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryEditor; 