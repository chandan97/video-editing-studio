import { Component, inject, OnInit } from '@angular/core'; // 👈 OnInit add kiya
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit { // 👈 implements OnInit add kiya
  private router = inject(Router);
  private http = inject(HttpClient);

  showModal = false;
  videoTitle = '';
  isCreating = false;
  selectedFile: File | null = null; 

  // 👇 Naya Variable: Asli data yahan save hoga
  projects: any[] = []; 

  // 👇 Page khulte hi ye function apne aap chalega
  ngOnInit() {
    this.loadProjects();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  openModal() {
    this.showModal = true;
    this.videoTitle = '';
    this.selectedFile = null;
  }

  closeModal() {
    this.showModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // 👇 NAYA FUNCTION: Backend se asli videos mangwane ke liye
  loadProjects() {
    // Note: Agar tumhara backend GET route kuch aur tha (jaise /api/projects/list), toh isko change kar lena
    //const apiUrl = 'http://localhost:3000/api/projects';
    // const apiUrl = 'http://34.100.162.127:3000/api/projects'; 
    const apiUrl = 'api/projects';

    this.http.get(apiUrl).subscribe({
      next: (res: any) => {
        // Backend response ke hisaab se array set karo (Agar res.data me bhej rahe ho toh res.data likhna)
        this.projects = res.data || res || []; 
      },
      error: (err) => {
        console.error('❌ Error in Getting projects:', err);
      }
    });
  }

  createProject() {
    if (!this.videoTitle || !this.selectedFile) {
      alert('Please provide both a project title and a video file.')
      return;
    }

    this.isCreating = true;
    //const apiUrl = 'http://localhost:3000/api/projects/create';
    // const apiUrl = 'http://34.100.162.127:3000/api/projects/create';
    const apiUrl = '/api/projects/create';

    const formData = new FormData();
    formData.append('userId', '1'); 
    formData.append('title', this.videoTitle);
    formData.append('video', this.selectedFile); 

    this.http.post(apiUrl, formData).subscribe({
      next: (res: any) => {
        console.log('✅ Project Created:', res);
       alert('Success! Your video project has been created. 🎬');
        this.closeModal();
        this.isCreating = false;
        
        // 👇 JAISE HI NAYA VIDEO BANE, LIST KO WAPAS REFRESH KARO
        this.loadProjects(); 
      },
      error: (err) => {
        console.error('❌ Error:', err);
        alert('Failed to create project: ' + (err.error?.error || 'An unexpected error occurred.'));
        this.isCreating = false;
      }
    });
  }
}