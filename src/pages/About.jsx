import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Vikas Gupta",
      role: "UI/UX DESIGNER",
      image: "/images/team/vikas.jpg",
      bio: "Passionate about creating beautiful and intuitive user interfaces. Expert in React and modern web technologies.",
      email: "vikas@talespire.com",
      github: "https://github.com/vikas",
      linkedin: "https://linkedin.com/in/vikas"
    },
    {
      name: "Sana Ur Rehman",
      role: "Frontend Developer",
      image: "/images/team/sana.jpg",
      bio: "Backend specialist with expertise in Node.js and MongoDB. Focused on building scalable and secure applications.",
      email: "sana@talespire.com",
      github: "https://github.com/sana",
      linkedin: "https://linkedin.com/in/sana"
    },
    {
      name: "Saurabh Upadhyay",
      role: "Backend Developer",
      image: "/images/team/saurabh.jpg",
      bio: "Full-stack developer with a passion for creating seamless user experiences. Skilled in both frontend and backend development.",
      email: "saurabh@talespire.com",
      github: "https://github.com/saurabh",
      linkedin: "https://linkedin.com/in/saurabh"
    },
    {
      name: "Sachin Yadav",
      role: "Head of team",
      image: "/images/team/sachin.jpg",
      bio: "Creative designer focused on crafting beautiful and user-friendly interfaces. Expert in user experience and visual design.",
      email: "sachin@talespire.com",
      github: "https://github.com/sachin",
      linkedin: "https://linkedin.com/in/sachin"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Collaborated in Project By
          </h1>
          <p className="text-lg text-gray-600">
            Meet the talented team behind TaleSpire
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 mb-4"
                    fallback={member.name[0]}
                  />
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <div className="flex space-x-3">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 