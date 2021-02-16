import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'My Tests', url: '/tests', icon: 'book' },
    { title: 'My Profile', url: '/my-profile', icon: 'person' },
    { title: 'Create Test', url: '/create-test', icon: 'mail' },
    { title: 'Upload Questions', url: '/upload-questions', icon: 'receipt' },
    { title: 'Class / Sections', url: '/class-section', icon: 'archive' },
    { title: 'Subjects', url: '/subject', icon: 'archive' },
    { title: 'Institution', url: '/institution-details', icon: 'heart' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    
  }
}
