import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image';
import { UserService } from '../../services/user';
import { ImageCardComponent } from '../image-card/image-card';
import { Post } from '../../models/post';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageCardComponent,
    MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class ExploreComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  isLoading = true;

  constructor(private imageService: ImageService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      [this.posts, this.users] = await Promise.all([
        this.imageService.getAllPosts(),
        this.userService.getAllUsers()
      ]);
      this.filteredPosts = this.posts;
      this.filteredUsers = this.users;
    } catch (error) {
      console.error('Error loading explore data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  search(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p =>
      p.caption?.toLowerCase().includes(q) || p.userName?.toLowerCase().includes(q)
    );
    this.filteredUsers = this.users.filter(u =>
      u.displayName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }
}
