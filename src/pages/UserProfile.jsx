import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Edit2, Save, BookOpen, Users, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stories, setStories] = useState([]);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUserData(response.data);
        setEditedData({
          name: response.data.name,
          email: response.data.email,
          bio: response.data.bio || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserStories = async () => {
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
      }
    };

    fetchUserData();
    fetchUserStories();
  }, [user, token, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        editedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                src={userData.avatar}
                alt={userData.name}
                className="w-20 h-20"
                fallback={userData.name[0]}
              />
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      name="name"
                      value={editedData.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold"
                    />
                    <Input
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                      className="text-gray-600"
                    />
                    <Input
                      name="bio"
                      value={editedData.bio}
                      onChange={handleInputChange}
                      placeholder="Write a short bio..."
                      className="text-gray-600"
                    />
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-gray-600">{userData.email}</p>
                    {userData.bio && <p className="mt-2 text-gray-600">{userData.bio}</p>}
                    <Button
                      onClick={handleEdit}
                      variant="ghost"
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold">{stories.length}</h3>
            <p className="text-gray-600">Stories</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold">{userData.collaborators?.length || 0}</h3>
            <p className="text-gray-600">Collaborators</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold">
              {new Date(userData.createdAt).toLocaleDateString()}
            </h3>
            <p className="text-gray-600">Member Since</p>
          </CardContent>
        </Card>
      </div>

      {/* User's Stories */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Stories</h2>
        <div className="grid gap-4">
          {stories.map((story) => (
            <Card key={story._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                <p className="text-gray-600 mb-4">
                  {story.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Last modified: {new Date(story.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/stories/${story._id}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue Writing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 