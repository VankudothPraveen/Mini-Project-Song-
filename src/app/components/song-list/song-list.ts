import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Song } from '../../models/song.model';
import { SongService } from '../../services/song';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss'
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  deleteConfirmId: number | null = null;

  constructor(
    private songService: SongService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const state = history.state as { toast?: string };
    if (state?.toast) {
      this.showSuccess(state.toast);
    }
    this.loadSongs();
  }

  loadSongs(): void {
    this.isLoading = true;
    this.error = null;
    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.songs = data || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = 'Failed to load songs. Is the backend running on port 8080?';
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error(err);
        });
      }
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  deleteSong(id: number): void {
    this.deleteConfirmId = null;
    this.songService.deleteSong(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.songs = this.songs.filter(s => s.id !== id);
          this.showSuccess('Song deleted successfully!');
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = 'Failed to delete song.';
          this.cdr.detectChanges();
          console.error(err);
        });
      }
    });
  }

  editSong(id: number): void {
    this.router.navigate(['/songs/edit', id]);
  }

  addSong(): void {
    this.router.navigate(['/songs/new']);
  }

  /** Returns count of unique artists */
  getUniqueArtists(): number {
    return new Set(this.songs.map(s => s.artist)).size;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.ngZone.run(() => {
        this.successMessage = null;
        this.cdr.detectChanges();
      });
    }, 4000);
  }

  formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
