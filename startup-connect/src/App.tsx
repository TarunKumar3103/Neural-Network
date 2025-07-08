import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import SwipeInterface from './components/SwipeInterface';
import { initializeSampleData } from './data/sampleData';
import { Startup, Match } from './types';
import { 
  HeartIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function AppContent() {
  const { user, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'profile'>('discover');

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
    
    // Load startups from localStorage
    const storedStartups = localStorage.getItem('startups');
    if (storedStartups) {
      setStartups(JSON.parse(storedStartups));
    }

    // Load matches from localStorage
    const storedMatches = localStorage.getItem('matches');
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  const handleSwipe = async (startupId: string, action: 'like' | 'pass') => {
    if (!user) return;

    // Store the swipe action
    const swipeActions = JSON.parse(localStorage.getItem('swipeActions') || '[]');
    const newSwipeAction = {
      startupId,
      userId: user.id,
      action,
      timestamp: new Date(),
    };
    swipeActions.push(newSwipeAction);
    localStorage.setItem('swipeActions', JSON.stringify(swipeActions));

    // If it's a like, create a potential match
    if (action === 'like') {
      const startup = startups.find(s => s.id === startupId);
      if (startup) {
        const newMatch: Match = {
          id: Math.random().toString(36).substr(2, 9),
          startupId: startup.id,
          employeeId: user.id,
          founderId: startup.founderId,
          status: 'pending',
          employeeLiked: true,
          founderLiked: false, // This would be determined when founder reviews
          createdAt: new Date(),
        };

        // For demo purposes, simulate some matches being mutual
        if (Math.random() > 0.3) {
          newMatch.founderLiked = true;
          newMatch.status = 'mutual';
        }

        const updatedMatches = [...matches, newMatch];
        setMatches(updatedMatches);
        localStorage.setItem('matches', JSON.stringify(updatedMatches));
      }
    }
  };

  // Filter startups that haven't been swiped on yet
  const getAvailableStartups = () => {
    if (!user) return [];
    
    const swipeActions = JSON.parse(localStorage.getItem('swipeActions') || '[]');
    const userSwipes = swipeActions.filter((swipe: any) => swipe.userId === user.id);
    const swipedStartupIds = userSwipes.map((swipe: any) => swipe.startupId);
    
    return startups.filter(startup => !swipedStartupIds.includes(startup.id));
  };

  const getMutualMatches = () => {
    return matches.filter(match => 
      match.status === 'mutual' && 
      (match.employeeId === user?.id || match.founderId === user?.id)
    );
  };

  if (!user) {
    return (
      <div className="App">
        {authMode === 'login' ? (
          <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-600">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">StartupConnect</h1>
              <p className="text-sm text-gray-600">Find your next opportunity</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.type}</p>
              {user.location && (
                <p className="text-xs text-gray-500">{user.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('discover')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'discover'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HeartIcon className="h-5 w-5" />
              Discover
              <span className="ml-auto bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getAvailableStartups().length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'matches'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Matches
              <span className="ml-auto bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getMutualMatches().length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              Profile
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'discover' && (
          <SwipeInterface 
            startups={getAvailableStartups()} 
            onSwipe={handleSwipe}
          />
        )}

        {activeTab === 'matches' && (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h1>
              
              {getMutualMatches().length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-900 mb-2">No matches yet</h2>
                  <p className="text-gray-600">
                    Keep swiping to find startup opportunities that match your interests!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getMutualMatches().map((match) => {
                    const startup = startups.find(s => s.id === match.startupId);
                    if (!startup) return null;
                    
                    return (
                      <div key={match.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{startup.name}</h3>
                            <p className="text-sm text-gray-600">{startup.industry}</p>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Mutual Match
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{startup.publicSummary}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {startup.lookingFor.slice(0, 2).map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {role}
                            </span>
                          ))}
                        </div>
                        <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                          Start Conversation
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-6">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserIcon className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600 capitalize">{user.type}</p>
                    {user.location && <p className="text-gray-600">{user.location}</p>}
                  </div>
                </div>

                {user.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.interests && user.interests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
