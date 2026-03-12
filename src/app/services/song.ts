import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:8080/songs'; // Keep based on backend controller

  constructor(private http: HttpClient) { }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/allsongs`);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  createSong(song: Song): Observable<Song> {
    return this.http.post<Song>(`${this.apiUrl}/add`, song);
  }

  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/update/${id}`, song);
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
