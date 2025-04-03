import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, X } from 'lucide-react';
import TextEditor from './TextEditor';
import CollaboratorManager from './CollaboratorManager';

const StoryEditor = ({ storyId = null, onClose }) => {
  const [showCollaborators, setShowCollaborators] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardContent className="flex-1 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowCollaborators(!showCollaborators)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Users className="h-4 w-4 mr-2" />
              Collaborators
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex h-[calc(100%-4rem)]">
            <div className={`flex-1 ${showCollaborators ? 'mr-4' : ''}`}>
              <TextEditor
                storyId={storyId}
                onBack={onClose}
              />
            </div>
            {showCollaborators && (
              <div className="w-80 overflow-y-auto">
                <CollaboratorManager
                  storyId={storyId}
                  onClose={() => setShowCollaborators(false)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryEditor; 