import { Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list';
import { SongFormComponent } from './components/song-form/song-form';

export const routes: Routes = [
  { path: '', redirectTo: '/songs', pathMatch: 'full' },
  { path: 'songs', component: SongListComponent },
  { path: 'songs/new', component: SongFormComponent },
  { path: 'songs/edit/:id', component: SongFormComponent },
  { path: '**', redirectTo: '/songs' }
];
