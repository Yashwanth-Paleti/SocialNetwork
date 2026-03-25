import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image';
import { ImageCardComponent } from '../image-card/image-card';
import { Post } from '../../models/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageService.getAllPosts()
      .then(posts => {
        this.posts = posts;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      });
  }
}
