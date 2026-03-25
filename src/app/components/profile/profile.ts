import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { ImageService } from '../../services/image';
import { ImageCardComponent } from '../image-card/image-card';
import { Post } from '../../models/post';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, ImageCardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  userId = '';
  currentUser: any = null;
  profileUser: any = null;
  userPosts: Post[] = [];
  isLoading = true;
  isEditing = false;
  editName = '';
  editBio = '';
  isOwnProfile = false;
  isFollowing = false;
  followerCount = 0;
  followingCount = 0;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => { this.currentUser = user; });
    this.route.params.subscribe(async params => {
      this.userId = params['id'];
      await this.loadProfile();
    });
  }

  async loadProfile(): Promise<void> {
    this.isLoading = true;
    try {
      this.profileUser = await this.userService.getUserById(this.userId);
      
      // Fallback for newly registered manual users
      if (!this.profileUser && this.currentUser?.uid === this.userId) {
        this.profileUser = {
          uid: this.currentUser.uid,
          displayName: this.currentUser.displayName,
          email: this.currentUser.email,
          photoURL: this.currentUser.photoURL,
          bio: '',
          followers: [],
          following: []
        };
      }

      if (this.profileUser) {
        const followers: string[] = Array.isArray(this.profileUser.followers) ? this.profileUser.followers : Object.values(this.profileUser.followers || {});
        const following: string[] = Array.isArray(this.profileUser.following) ? this.profileUser.following : Object.values(this.profileUser.following || {});
        this.followerCount = followers.length;
        this.followingCount = following.length;
        this.isOwnProfile = this.currentUser?.uid === this.userId;
        this.isFollowing = followers.includes(this.currentUser?.uid);
        this.editName = this.profileUser.displayName || '';
        this.editBio = this.profileUser.bio || '';
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }

    // Set isLoading to false as soon as user profile info is handled, 
    // regardless of whether user exists or posts are loaded.
    this.isLoading = false;

    try {
      this.userPosts = await this.imageService.getPostsByUser(this.userId);
    } catch (error) {
      console.error('Error loading user posts:', error);
      this.userPosts = [];
    }
  }

  startEditing(): void { this.isEditing = true; }

  async saveProfile(): Promise<void> {
    try {
      await this.userService.updateProfile(this.userId, {
        displayName: this.editName,
        bio: this.editBio
      });
      this.profileUser.displayName = this.editName;
      this.profileUser.bio = this.editBio;
      this.isEditing = false;
    } catch (error) { console.error('Error updating profile', error); }
  }

  async toggleFollow(): Promise<void> {
    if (!this.currentUser) return;
    const nowFollowing = await this.userService.toggleFollow(this.currentUser.uid, this.userId);
    this.isFollowing = nowFollowing;
    this.followerCount += nowFollowing ? 1 : -1;
  }
}
