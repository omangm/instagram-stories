export interface Story {
  id: string;
  imageUrl: string;
  username: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  profilePicture: string;
  stories: Story[];
}

export interface StoriesData {
  users: User[];
}