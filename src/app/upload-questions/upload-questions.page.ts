import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from "@ionic/storage";

type AOA = any[][];
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-upload-questions',
  templateUrl: './upload-questions.page.html',
  styleUrls: ['./upload-questions.page.scss'],
})
export class UploadQuestionsPage implements OnInit {
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  [x: string]: any;
  data: any = [];
  newData: any = [];
  subjects: any = [];
  tests: any = [];
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private dataService: DataService,
    public storage: Storage,
    public navCtrl: NavController,
  ) { 
    this.storage.get("loggedUser").then(res => {
      if (res) {
        this.user = res;
        console.log(this.user);
        this.getClasseslist();
      } else {
        this.navCtrl.navigateRoot('/login');
      }

    });
  }
  async chooseTests(){
    console.log(this.class_id);
    this.getTests();
  }
  async chooseSubject(){
    console.log(this.class_id);
    console.log('Getting Subjects');
    let loading = await this.loadingCtrl.create({
      message: 'Loading Subjects...'
    });
    await loading.present();
    this.dataService.get_class_subjects(this.class_id,this.user.institution_id)
      .then(res => {
        console.log(res);
        this.subjects = res;
        loading.dismiss();
      })
      .catch(err => {
        console.log(err);
        loading.dismiss();
      });
  }
  async getTests(){
    console.log(this.subject_id);
    console.log('Getting Tests');
    let loading = await this.loadingCtrl.create({
      message: 'Loading Exams...'
    });
    await loading.present();
    let today = moment(new Date()).format("YYYY-MM-DD");
    console.log(today);
    let today1 = new Date(today).getTime();
    console.log(today1);
    this.dataService.get_class_tests(this.class_id,this.subject_id,this.user.institution_id)
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
          loading.dismiss();
        }
      })
      .catch(err => {
        console.log(err);
        loading.dismiss();
      });
  }
  async getClasseslist() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Classes...'
    });
    await loading.present();
    this.dataService.get_classes("class", this.user.institution_id)
      .then(res => {
        console.log(res);
        this.classes = res;
        this.classes1 = res;
        loading.dismiss();
        if (this.classes.length < 1) {
          this.noClasses = "No Classes to show. Kindly add.";
        } else {
          //
        }
      }).catch(err => {
        loading.dismiss();
        console.log(err);
      });
  }
  ngOnInit() {

  }

  onFileChange(evt: any) {
    /* wire up file reader */
    //console.log(evt);
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      console.log(e);
      /* read workbook */
      const bstr: string = e.target.result;
      //console.log(bstr);
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(JSON.stringify(this.data));
      let headerRow = Object.values(this.data[0]);
      let options_answers = [];
      console.log(headerRow);
      for (let b = 1; b < this.data.length; b++) {
        options_answers = [];
        let dataRow = Object.values(this.data[b]);
        if(dataRow[1]==="fill_blank"){
          this.question = {
            "question_no": dataRow[0],
            "question_type": dataRow[1],
            "question_mark": dataRow[2],
            "question": dataRow[3],
            "name": "question"+dataRow[0],
            "correct_answer": dataRow[4]
          }
          this.newData.push(this.question);
        }else if(dataRow[1]==="optional"){
          options_answers.push(dataRow[4].toString());
          options_answers.push(dataRow[5].toString());
          options_answers.push(dataRow[6].toString());
          this.question = {
            "question_no": dataRow[0].toString(),
            "question_type": dataRow[1].toString(),
            "question_mark": dataRow[2].toString(),
            "question": dataRow[3].toString(),
            "name": "question"+dataRow[0].toString(),
            "optional_answers": options_answers,
            "correct_answer": dataRow[7].toString()
          }
          this.newData.push(this.question);
        }       

        
        console.log(JSON.stringify(this.newData));
        
      }

    };
    reader.readAsBinaryString(target.files[0]);
  }

  async upload_questions() {
    let loading = await this.loadingCtrl.create({
      message: 'Uploading questions...'
    });
    await loading.present();
    console.log(this.test_id);
    let questions = { questions: this.newData };
    this.dataService.upload_test_questions(this.test_id, questions).then(async res => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Questions uploaded',
        message: 'Questions uploaded successfully..',
        buttons: [
          {
            text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
              this.navCtrl.navigateRoot('/tests');
            }
          }
        ]
      });
      await alert.present();
    }).catch(async err => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error..',
        message: 'Error uploading questions.. Try again or later.',
        buttons: [
          {
            text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
              //this.navCtrl.navigateRoot('/tests');
            }
          }
        ]
      });
      await alert.present();
    });
  }

}
