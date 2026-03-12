import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Song } from '../../models/song.model';
import { SongService } from '../../services/song';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './song-form.html',
  styleUrl: './song-form.scss'
})
export class SongFormComponent implements OnInit {
  song: Song = {
    title: '',
    artist: '',
    genre: '',
    duration: 180,
    releaseDate: new Date().toISOString().split('T')[0]
  };

  isEditing = false;
  isLoading = false;
  error: string | null = null;
  durationString = '3:00';

  constructor(
    private songService: SongService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.isLoading = true;
      this.songService.getSongById(+id).subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.song = data;
            // Normalize date for <input type="date"> (YYYY-MM-DD)
            if (this.song.releaseDate) {
              const d = new Date(this.song.releaseDate);
              if (!isNaN(d.getTime())) {
                this.song.releaseDate = d.toISOString().split('T')[0];
              }
            }
            // Format duration seconds → mm:ss string
            const totalSecs = this.song.duration || 0;
            const m = Math.floor(totalSecs / 60);
            const s = (totalSecs % 60).toString().padStart(2, '0');
            this.durationString = `${m}:${s}`;

            this.isLoading = false;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.error = 'Failed to load track details.';
            this.isLoading = false;
            this.cdr.detectChanges();
            console.error(err);
          });
        }
      });
    }
  }

  /** Parse mm:ss or plain seconds string into number of seconds */
  private parseDuration(): number {
    const raw = (this.durationString || '').trim();
    const parts = raw.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      return mins * 60 + secs;
    }
    return parseInt(raw, 10) || 0;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.error = null;
    this.song.duration = this.parseDuration();

    if (this.isEditing && this.song.id) {
      this.songService.updateSong(this.song.id, this.song).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/songs'], { state: { toast: 'Track updated successfully! 🎵' } });
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.error = 'Failed to update track. Please check the backend connection.';
            this.isLoading = false;
            this.cdr.detectChanges();
            console.error(err);
          });
        }
      });
    } else {
      this.songService.createSong(this.song).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/songs'], { state: { toast: 'Track added successfully! 🚀' } });
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.error = 'Failed to save track. Please check the backend connection.';
            this.isLoading = false;
            this.cdr.detectChanges();
            console.error(err);
          });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/songs']);
  }
}
