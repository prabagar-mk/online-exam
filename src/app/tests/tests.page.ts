import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../services/data.service";
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { IonContent, ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.page.html',
  styleUrls: ['./tests.page.scss'],
})
export class TestsPage implements OnInit {
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  [x: string]: any;
  user: any = {};
  tests: any = [];
  constructor(
    private router: Router,
    public storage: Storage,
    private dataService: DataService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    
    this.storage.get("loggedUser")
      .then(res => {
        if (res) {
          this.user = res;
          this.getTests();
        }
      })
      .catch(err => {
        console.log(err);
      });    
  }

  ngOnInit() {

  }
  async getTests(){
    let loading = await this.loadingCtrl.create({
      message: 'Loading Tests...'
    });
    await loading.present();
    let today = moment(new Date()).format("YYYY-MM-DD");
    console.log(today);
    let today1 = new Date(today).getTime();
    console.log(today1);
    this.dataService.get_tests(this.user.institution_id)
      .then(res => {
        console.log(res);
        this.tests = res;
        if (this.tests.length > 0) {
          this.tests.forEach((t, index) => {
            let testDate = moment(t.test_date).format("YYYY-MM-DD");
            console.log(testDate);
            let testDate1 = new Date(testDate).getTime();
            console.log(testDate1);
            if (today1 > testDate1) {
              console.log(today+' greater than '+testDate)
              t.status = "expired";
            }
            if(index === this.tests.length-1){
              loading.dismiss();
            }
          });
        }else{
          this.noTests = "No tests to show.";
          loading.dismiss();
        }
      })
      .catch(err => {
        console.log(err);
        loading.dismiss();
      });
  }
  async getQuestions(test) {
    this.storage.set("test", test);
    console.log(test);
    this.navCtrl.navigateRoot('/questions');
  }
  async add_test(){
    this.navCtrl.navigateRoot('/create-test');
  }
  async goTop() {
    this.ionContent.scrollToTop(300);
  }
  async doRefresh(event: any) {
    this.getTests().then(res => {
      event.target.complete();
    })
    .catch(err => {
      event.target.complete();
    });
    
  }

}
