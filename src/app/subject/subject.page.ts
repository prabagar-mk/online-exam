import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.page.html',
  styleUrls: ['./subject.page.scss'],
})
export class SubjectPage implements OnInit {
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  [x: string]: any;
  classes: any = [];
  classes1: any = [];
  subjects: any = [];
  subjects1: any = [];
  searchList: any = [];
  searchList1: any = [];
  constructor(public storage: Storage,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private dataService: DataService,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
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
  initializeItems(): void {
    this.searchList = this.classes1;
  }
  async getClasses(searchbar) {
    this.initializeItems();
    var q = searchbar.srcElement.value;
    //console.log(q);
    if (q.length === 0) {
      this.classes = this.classes1;
      //this.loadAreas();
      return;
    }
    if (this.searchList && this.searchList.length > 0) {
      //this.areas = [];
      this.classes = this.searchList.filter((v) => {
        if (v && v.class_id && v.class_name && q) {
          if (v.class_id && v.class_id.indexOf(q) > -1) {
            return true;
          } else if (v.class_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
        }
      });
    }
  }
  async initializeItemsSubject() {
    this.searchList1 = this.sections1;
  }
  async getSubjects(searchbar) {
    this.initializeItemsStreet();
    var q = searchbar.srcElement.value;
    //console.log(q);
    if (q.length === 0) {
      this.streets = this.streets1;
      //this.loadAreas();
      return;
    }
    if (this.searchList1 && this.searchList1.length > 0) {
      this.subjects = this.searchList1.filter((v) => {
        if (v && v.subject_id && v.subject_name && q) {
          if (v.subject_id && v.subject_id.indexOf(q) > -1) {
            return true;
          } else if (v.subject_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
        }
      });
    }
  }
  async getClasseslist() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Class List...'
    });
    await loading.present();
    this.dataService.get_classes("class", this.user.institution_id)
      .then(res => {
        console.log(res);
        this.classes = res;
        this.classes1 = res;
        if (this.classes.length < 1) {
          this.noClasses = "No Classes to show. Kindly add.";
        } else {
          loading.dismiss();
        }
      }).catch(err => {
        loading.dismiss();
        console.log(err);
      });
  }
  async loadSubjectsList(id) {
    this.subjects = [];
    this.subjects1 = [];
    this.dataService.get_class_subjects(id,this.user.institution_id)
      .then(res => {
        console.log(res);
        this.subjects = res;
        this.subjectss1 = res;
      }).catch(err => {
        console.log(err);
      });
  }
  async loadSubjects(cl) {
    console.log(cl);
    this.classes.forEach((c, ind) => {
      if (c.keyId === cl) {
        console.log(cl + " : " + c.keyId);
        if (c.showSubjects) {
          c.showSubjects = false;
          this.subjects = [];
        } else {
          c.showSubjects = true;
          this.loadSubjectsList(cl);
        }
      } else {
        c.showSubjects = false;
      }
    });

  }
  async delSubject(cl) {

  }

  async goTop() {
    this.ionContent.scrollToTop(300);
  }
  async add_subject() {
    this.navCtrl.navigateRoot('/add-class-section');
  }

  async doRefresh(event: any) {
    this.getClasseslist().then(res => {
      event.target.complete();
    })
    .catch(err => {
      event.target.complete();
    });
    
  }
}
