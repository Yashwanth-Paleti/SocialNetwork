import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ImageService } from '../../services/image';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule,
    MatButtonModule, MatFormFieldModule, MatIconModule],
  templateUrl: './upload-image.html',
  styleUrl: './upload-image.css'
})
export class UploadImageComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  caption = '';
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';

  constructor(private imageService: ImageService, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.previewUrl = e.target.result; };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.previewUrl = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async uploadPost(): Promise<void> {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.errorMessage = '';
    try {
      await this.imageService.uploadImage(this.selectedFile, this.caption);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = 'Upload failed. Please try again.';
    } finally {
      this.isUploading = false;
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
