import { JSX, useState, useEffect } from 'react';
import StoryOverview from './StoryOverview';
import { fetchStories } from '../services/api';
import { User } from '../types';
import LoadingSpinner from './LoadingSpinner';

function StoriesList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStories = async (): Promise<void> => {
      try {
        const data = await fetchStories();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error loading stories:', error);
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading stories..." />;
  }

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-2xl font-bold">Instagram</h1>
      <div className="flex space-x-4 overflow-x-auto py-4">
        {users.map(user => (
          <StoryOverview
            key={user.id}
            user={user}
            firstStoryId={user.stories[0]?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default StoriesList;