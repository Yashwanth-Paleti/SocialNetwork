import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../models/post';
import { ImageService } from '../../services/image';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './image-card.html',
  styleUrl: './image-card.css'
})
export class ImageCardComponent implements OnInit {
  @Input() post!: Post;
  isLiked = false;
  currentUserId = '';

  constructor(private imageService: ImageService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.isLiked = Array.isArray(this.post.likes) && this.post.likes.includes(user.uid);
      }
    });
  }

  async toggleLike(): Promise<void> {
    if (!this.currentUserId) return;
    if (this.isLiked) {
      await this.imageService.unlikePost(this.post.id, this.currentUserId);
      this.post.likes = (this.post.likes || []).filter(id => id !== this.currentUserId);
    } else {
      await this.imageService.likePost(this.post.id, this.currentUserId);
      this.post.likes = [...(this.post.likes || []), this.currentUserId];
    }
    this.isLiked = !this.isLiked;
  }

  get likeCount(): number {
    return Array.isArray(this.post.likes) ? this.post.likes.length : 0;
  }

  get commentCount(): number {
    return Array.isArray(this.post.comments) ? this.post.comments.length : 0;
  }
}
