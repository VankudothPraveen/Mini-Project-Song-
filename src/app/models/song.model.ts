export interface Song {
  id?: number;
  title: string;
  artist: string;
  genre: string;
  duration: number; // Duration in seconds
  releaseDate: string | Date; // ISO string date
}
