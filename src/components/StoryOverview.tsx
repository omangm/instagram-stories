import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface StoryOverviewProps {
  user: User;
  firstStoryId?: string;
}

function StoryOverview({ user, firstStoryId }: StoryOverviewProps): JSX.Element {
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (firstStoryId) {
      navigate(`/stories/${user.id}/${firstStoryId}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={handleClick}
      data-testid={`story-circle-${user.id}`}
    >
      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-500">
        <OptimizedImage
          src={user.profilePicture}
          alt={user.username}
          className="w-full h-full object-cover rounded-full border-2 border-white"
          width={64}
          height={64}
        />
      </div>
      <span className="text-xs mt-1">{user.username}</span>
    </div>
  );
}

export default StoryOverview;