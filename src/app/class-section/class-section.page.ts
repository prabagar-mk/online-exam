import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-class-section',
  templateUrl: './class-section.page.html',
  styleUrls: ['./class-section.page.scss'],
})

export class ClassSectionPage implements OnInit {
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  [x: string]: any;
  classes: any = [];
  classes1: any = [];
  sections: any = [];
  sections1: any = [];
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
    if (q.length === 0) {
      this.classes = this.classes1;
      return;
    }
    if (this.searchList && this.searchList.length > 0) {
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
  async initializeItemsStreet() {
    this.searchList1 = this.sections1;
  }
  async getSections(searchbar) {
    this.initializeItemsStreet();
    var q = searchbar.srcElement.value;
    if (q.length === 0) {
      this.streets = this.streets1;
      return;
    }
    if (this.searchList1 && this.searchList1.length > 0) {
      this.sections = this.searchList1.filter((v) => {
        if (v && v.section_id && v.section_name && q) {
          if (v.section_id && v.section_id.indexOf(q) > -1) {
            return true;
          } else if (v.section_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
        }
      });
    }
  }
  async getClasseslist() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Areas...'
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
  async loadSectionsList(id) {
    this.sections = [];
    this.sections1 = [];
    this.dataService.get_class_sections(id)
      .then(res => {
        console.log(res);
        this.sections = res;
        this.sections1 = res;
      }).catch(err => {
        console.log(err);
      });
  }
  async loadSections(cl) {
    console.log(cl);
    this.classes.forEach((c, ind) => {
      if (c.keyId === cl) {
        console.log(cl + " : " + c.keyId);
        if (c.showSections) {
          c.showSections = false;
          this.sections = [];
        } else {
          c.showSections = true;
          this.loadSectionsList(cl);
        }
      } else {
        c.showSections = false;
      }
    });

  }
  async delClass(cl) {

  }
  async add_class_section() {
    this.navCtrl.navigateRoot('/add-class-section');
  }
  async goTop() {
    this.ionContent.scrollToTop(300);
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
