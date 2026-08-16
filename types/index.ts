// created by Yivani yivani.dev
export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  externalLink: string;
  profileImage: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface Comment {
  id: string;
  username: string;
  profileImage?: string;
  text: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  imageUrl: string;
  images?: string[];
  caption: string;
  likes: number;
  date: string;
  location?: string;
  hashtags?: string[];
  comments?: Comment[];
}
