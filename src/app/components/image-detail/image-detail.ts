import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageService } from '../../services/image';
import { AuthService } from '../../services/auth';
import { Post } from '../../models/post';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './image-detail.html',
  styleUrl: './image-detail.css'
})
export class ImageDetailComponent implements OnInit {
  post: Post | null = null;
  isLiked = false;
  newComment = '';
  currentUser: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => { this.currentUser = user; });
    this.route.params.subscribe(async params => {
      this.post = await this.imageService.getPostById(params['id']);
      if (this.post && this.currentUser) {
        this.isLiked = Array.isArray(this.post.likes) && this.post.likes.includes(this.currentUser.uid);
      }
      this.isLoading = false;
    });
  }

  async likePost(): Promise<void> {
    if (!this.post || !this.currentUser) return;
    if (this.isLiked) {
      await this.imageService.unlikePost(this.post.id, this.currentUser.uid);
      this.post.likes = (this.post.likes || []).filter((id: string) => id !== this.currentUser.uid);
    } else {
      await this.imageService.likePost(this.post.id, this.currentUser.uid);
      this.post.likes = [...(this.post.likes || []), this.currentUser.uid];
    }
    this.isLiked = !this.isLiked;
  }

  async addComment(): Promise<void> {
    if (!this.newComment.trim() || !this.post || !this.currentUser) return;
    const comment = {
      userId: this.currentUser.uid,
      userName: this.currentUser.displayName || 'User',
      userPhoto: this.currentUser.photoURL || '',
      text: this.newComment.trim()
    };
    await this.imageService.addComment(this.post.id, comment);
    if (!Array.isArray(this.post.comments)) this.post.comments = [];
    this.post.comments.push({ ...comment, createdAt: new Date() });
    this.newComment = '';
  }

  get likeCount(): number {
    return Array.isArray(this.post?.likes) ? this.post!.likes.length : 0;
  }
}
