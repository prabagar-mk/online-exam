import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DataService } from "./services/data.service";
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  student: any;
  loggedUser: any;
  authPersonChangedSubscription: Subscription;
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Exam List', url: '/tests', icon: 'book' },
    { title: 'My Profile', url: '/my-profile', icon: 'person' },
    //{ title: 'Create Test', url: '/create-test', icon: 'mail' },
    { title: 'Upload Questions', url: '/upload-questions', icon: 'receipt' },
    { title: 'Class / Sections', url: '/class-section', icon: 'archive' },
    { title: 'Subjects', url: '/subject', icon: 'archive' },
    { title: 'Institution', url: '/institution-details', icon: 'heart' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    private dataService: DataService,
    public loadingCtrl: LoadingController
  ) {
    this.storage.get("loggedUser").then(res => {
      if (res) {
        this.loggedUser = res;        
      } else {
        this.navCtrl.navigateRoot('/');
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    
    this.authPersonChangedSubscription = this.dataService.authPersonC$.subscribe(
      (val) => {
        this.loggedUser = val;
      });
    }
  async logout() {
    console.log("logout");
    let loading = await this.loadingCtrl.create({
      message: 'Signing out...'
    });
    await loading.present();
    this.dataService.doLogout().then(res => {
      console.log(res);
      this.navCtrl.navigateRoot("/");
      loading.dismiss();
    }).catch(err => {
      console.log(err);
    })

  }
}
