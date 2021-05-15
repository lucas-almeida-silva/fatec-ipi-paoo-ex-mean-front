export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  imageUrl: string;
}

export interface PostBook {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  image?: File;
}
