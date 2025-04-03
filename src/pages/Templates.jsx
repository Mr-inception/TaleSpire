import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Hero's Journey",
      genre: "Adventure",
      description: "A structured story arc for adventure tales.",
      image: "/images/template1.png",
      difficulty: "Beginner",
      estimatedTime: "2-3 hours"
    },
    {
      id: 2,
      title: "Romance Arc",
      genre: "Romance",
      description: "A love-driven story template.",
      image: "/images/template2.png",
      difficulty: "Intermediate",
      estimatedTime: "3-4 hours"
    },
    {
      id: 3,
      title: "Mystery Plot",
      genre: "Mystery",
      description: "A template for crafting thrilling mysteries.",
      image: "/images/template3.png",
      difficulty: "Advanced",
      estimatedTime: "4-5 hours"
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUseTemplate = (template) => {
    // Navigate to story editor with template
    console.log('Use template:', template);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Story Templates</h1>
        <Button>Create Template</Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.genre}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{template.difficulty}</span>
                    <span className="mx-2">•</span>
                    <span>{template.estimatedTime}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleUseTemplate(template)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates; 