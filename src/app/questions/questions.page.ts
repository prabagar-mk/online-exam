import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { IonContent, ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  [x: string]: any;
  user: any = {};
  test: any = {};
  questions: any = [];
  showAnswers = false;
  showQuestions = false;
  constructor(
    private router: Router,
    public storage: Storage,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private dataService: DataService
  ) {
    
  }
  ionViewWillEnter() {
    this.showAnswers = false;
    this.testStartTime = new Date();  
    
  }
  async startExam(){
    this.startTime = moment(new Date()).format("DD-MM-YYYY hh:mm:ss a");
    this.showQuestions = true;
    this.get_duration_interval= setInterval(()=> { 
      this.calculateTime();
     }, 1000);
  }
  async calculateTime(){
    this.now = new Date().getTime();
    var seconds = ((this.now - this.testStartTime.getTime()) / 60000).toString();
    
    this.timeConsumed = seconds.substring(0,5)+" minutes";
    if(parseInt(this.timeConsumed) >= this.test.time_allowed){
      clearInterval(this.get_duration_interval);
      const alert = await this.alertCtrl.create({
        header: 'Time Over',
        message: 'Total allowed time is over. Your answers will be auto-submitted.',
        buttons: [
          { text: 'OK', role: 'cancel', cssClass: 'secondary', handler: () => { 
            this.submitAnswers(this.test);
           } },
          { text: 'CANCEL', handler: () => {
            //
           } }]
      });
      await alert.present();
    }
  }
  ngOnInit() {
    this.storage.get("loggedUser")
      .then(res => {
        if (res) {
          this.user = res;
          console.log(this.user);
          this.storage.get("test")
            .then(res1 => {
              if (res1) {
                this.test = res1;
                this.test.test_date = moment(this.test.test_date).format("DD-MM-YYYY");
                console.log(this.test);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });

  }
  async answerChange(q){
    console.log(q);
  }
  async submitAnswers(test){
    clearInterval(this.get_duration_interval);
    test.questions.forEach((q,index) => {
      if(q.answer){
        q.answer = q.answer.trim();
      }      
      if(index === test.questions.length-1){
        console.log(JSON.stringify(test));
        this.showAnswers = true;
      }
    });
    
  }
  async cancel(){
    this.showAnswers = false;
    this.storage.remove("test");
    this.navCtrl.navigateRoot('/tests');
  }

}
