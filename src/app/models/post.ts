export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
  likes?: string[];
  comments?: Comment[];
}

export interface Comment {
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: any;
}
