import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - in real app, this would be an API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email!,
        name: userData.name!,
        type: userData.type!,
        avatar: userData.avatar,
        bio: userData.bio,
        location: userData.location,
        skills: userData.skills || [],
        interests: userData.interests || [],
        linkedinUrl: userData.linkedinUrl,
        githubUrl: userData.githubUrl,
        createdAt: new Date(),
      };

      // Store user in localStorage (in real app, this would be sent to API)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }

      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};