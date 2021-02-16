import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { IonContent, LoadingController, ModalController, ToastController, AlertController, Platform, NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.page.html',
  styleUrls: ['./create-test.page.scss'],
})
export class CreateTestPage implements OnInit {
  [x: string]: any;
  test: any = {
    addedById: "",
    addedByName: "",
    addedDate: new Date().toISOString(),
    institution_id: "1",
    isDeleted: false,
    modifiedById: "",
    modifiedByName: "",
    modifiedDate: new Date().toISOString(),
    questions: [],
    status: "active"
  };
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public storage: Storage,
    private dataService: DataService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
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
  async getClasseslist() {
    this.classes = [];
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

  get uniqueTest_id() {
    return this.examForm.get("uniqueTest_id");
  }
  get test_date() {
    return this.examForm.get("test_date");
  }
  get test_name() {
    return this.examForm.get("test_name");
  }
  get test_class_id() {
    return this.examForm.get("test_class_id");
  }
  // get section_id() {
  //   return this.examForm.get("section_id");
  // }
  get test_subject_id() {
    return this.examForm.get("test_subject_id");
  }
  get no_of_questions() {
    return this.examForm.get("no_of_questions");
  }
  get total_marks() {
    return this.examForm.get("total_marks");
  }
  get time_allowed() {
    return this.examForm.get("time_allowed");
  }
  public errorMessages = {
    uniqueTest_id: [
      { type: 'required', message: 'Enter test ID' }
    ], 
    test_date: [
      { type: 'required', message: 'Exam Date required' }
    ],
    test_name: [
      { type: 'required', message: 'Exam Date required' }
    ],
    test_class_id: [
      { type: 'required', message: 'Class required' }
    ],
    // section_id: [
    //   { type: 'required', message: 'Section required' }
    // ],
    test_subject_id: [
      { type: 'required', message: 'Subject required' }
    ],
    no_of_questions: [
      { type: 'required', message: 'No of Questions required' }
    ],
    total_marks: [
      { type: 'required', message: 'Total Marks required' }
    ],
    time_allowed: [
      { type: 'required', message: 'Time allowed required' }
    ]
  };

  examForm = this.formBuilder.group({
    uniqueTest_id: ['', [Validators.required]],
    test_date: ['', [Validators.required]],
    test_name: ['', [Validators.required]],
    test_class_id: ['', [Validators.required]],
    //section_id: ['', [Validators.required]],
    test_subject_id: ['',  [Validators.required]],
    no_of_questions: ['',  [Validators.required]],
    total_marks: ['',  [Validators.required]],
    time_allowed: ['',  [Validators.required]]
  });

  async class_change() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Subjects...'
    });
    await loading.present();
    this.subjects = [];
    console.log(this.examForm.value.test_class_id);
    
    this.dataService.get_class_subjects(this.examForm.value.test_class_id,this.user.institution_id).then(res => {
      this.subjects = res;
      loading.dismiss();
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    })
  }
  async subject_change() {
    
  }

  async submit() {
    console.log(this.test);
    console.log(this.examForm.value);
    if(this.classes && this.classes.length>0){
      this.classes.forEach((c,ind) => {
        if(c.keyId === this.examForm.value.test_class_id){
          this.test.class_id = c.class_id;
        }
      });
    }
    if(this.subjects && this.subjects.length>0){
      this.subjects.forEach((s,ind) => {
        if(s.keyId === this.examForm.value.test_subject_id){
          this.test.subject_id = s.subject_id;
        }
      });
    }
    this.test.institution_id = this.user.institution_id;
    this.test.addedById = this.user.userId;
    this.test.addedByName = this.user.firstName+" "+this.user.lastName;
    this.test.uniqueTest_id = this.examForm.value.uniqueTest_id;
    this.test.test_class_id = this.examForm.value.test_class_id;
    this.test.no_of_questions = this.examForm.value.no_of_questions;
    //this.test.section_id = this.examForm.value.section_id;
    this.test.test_subject_id = this.examForm.value.test_subject_id;
    this.test.test_date = this.examForm.value.test_date;
    this.test.test_name = this.examForm.value.test_name;
    this.test.time_allowed = this.examForm.value.time_allowed;
    this.test.total_marks = this.examForm.value.total_marks;
    this.test.modifiedById = this.user.userId;
    this.test.modifiedByName = this.user.firstName+" "+this.user.lastName;
    console.log(this.test);
    this.dataService.add_Record("questions",this.test)
    .then(async res => {
      console.log(res);
      const alert = await this.alertCtrl.create({
        header: 'New Test Added',
        message: 'New Test with id '+this.test.uniqueTest_id+' added successfully..',
        buttons: [
          {
            text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
              this.navCtrl.navigateRoot('/tests');
            }
          }
        ]
      });
      await alert.present();
    })
    .catch(err => {

    })
  }
}
