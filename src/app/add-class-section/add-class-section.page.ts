import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-class-section',
  templateUrl: './add-class-section.page.html',
  styleUrls: ['./add-class-section.page.scss'],
})
export class AddClassSectionPage implements OnInit {
  [x: string]: any;
  classes: any = [];
  class: any = {
    class_id: "",
    class_name: ""
  };
  section: any = {
    class_id: "",
    section_id: "",
    section_name: ""
  };
  subject: any = {
    class_id: "",
    subject_id: "",
    subject_name: ""
  };
  addclass = false;
  addsection = false;
  addsubject = false;
  constructor(public storage: Storage,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private dataService: DataService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.storage.get("loggedUser").then(res => {
      if (res) {
        this.user = res;
        console.log(this.user);
        this.loadClassList();
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });

  }
  async loadClassList() {
    this.dataService.get_classes("class", this.user.institution_id)
      .then(res => {
        console.log(res);
        this.classes = res;
      }).catch(err => {
        console.log(err);
      });
  }
  async addClass() {
    this.title = "Class";
    this.addclass = true;
    this.addsection = false;
    this.addsubject = false;
  }
  async addSection() {
    this.title = "Section";
    this.addclass = false;
    this.addsection = true;
    this.addsubject = false;
  }
  async addSubject() {
    this.title = "Subject";
    this.addclass = false;
    this.addsection = false;
    this.addsubject = true;
  }
  get class_id() {
    return this.classForm.get("class_id");
  }
  get class_name() {
    return this.classForm.get("class_name");
  }

  get section_class_id() {
    return this.sectionForm.get("section_class_id");
  }
  get section_id() {
    return this.sectionForm.get("section_id");
  }
  get section_name() {
    return this.sectionForm.get("section_name");
  }

  get subject_class_id() {
    return this.subjectForm.get("subject_class_id");
  }
  get subject_id() {
    return this.subjectForm.get("subject_id");
  }
  get subject_name() {
    return this.subjectForm.get("subject_name");
  }

  public errorMessages = {
    class_id: [
      { type: 'required', message: 'Class ID is required' },
      { type: 'maxlength', message: 'ID cant be longer than 100 characters' }
    ],
    class_name: [
      { type: 'required', message: 'Class Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    section_class_id: [
      { type: 'required', message: 'Class ID is required' },
      { type: 'maxlength', message: 'ID cant be longer than 100 characters' }
    ],
    section_id: [
      { type: 'required', message: 'Section ID is required' },
      { type: 'maxlength', message: 'ID cant be longer than 100 characters' }
    ],
    section_name: [
      { type: 'required', message: 'Section Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    subject_class_id: [
      { type: 'required', message: 'Class ID is required' },
      { type: 'maxlength', message: 'ID cant be longer than 100 characters' }
    ],
    subject_id: [
      { type: 'required', message: 'Subject ID is required' },
      { type: 'maxlength', message: 'ID cant be longer than 100 characters' }
    ],
    subject_name: [
      { type: 'required', message: 'Subject Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ]
  };

  classForm = this.formBuilder.group({
    class_id: ['', [Validators.required, Validators.maxLength(100)]],
    class_name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  sectionForm = this.formBuilder.group({
    section_class_id: ['', [Validators.required, Validators.maxLength(100)]],
    section_id: ['', [Validators.required, Validators.maxLength(100)]],
    section_name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  subjectForm = this.formBuilder.group({
    subject_class_id: ['', [Validators.required, Validators.maxLength(100)]],
    subject_id: ['', [Validators.required, Validators.maxLength(100)]],
    subject_name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  async submitClass() {
    let loading = await this.loadingCtrl.create({
      message: 'Saving Class Details...'
    });
    await loading.present();
    this.class.class_id = this.classForm.value.class_id;
    this.class.class_name = this.classForm.value.class_name;
    this.class.institution_id = this.user.institution_id;
    this.class.addedById = this.user.userId;
    this.class.addedByName = this.user.firstName + " " + this.user.lastName;
    this.class.addedDate = new Date().toISOString();
    this.class.modifiedById = this.user.userId;
    this.class.modifiedByName = this.user.firstName + " " + this.user.lastName;
    this.class.modifiedDate = new Date().toISOString();
    this.class.status = "active";
    this.class.isDeleted = false;
    console.log(this.classForm.value);
    console.log(this.class);

    this.dataService.add_Record("class", this.class)
      .then(async res => {
        this.loadClassList();
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Class Added/updated',
          message: 'Class details added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                this.classForm.reset();
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(async err => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Class not Added/updated',
          message: 'Class details not added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                //this.classForm.reset();
              }
            }
          ]
        });
        await alert.present();
      });
  }

  async submitSection() {
    let loading = await this.loadingCtrl.create({
      message: 'Saving Section Details...'
    });
    await loading.present();
    this.section.section_class_id = this.sectionForm.value.section_class_id;
    this.classes.forEach((c, index) => {
      if (c.keyId === this.section.section_class_id) {
        this.section.class_id = c.class_id;
      }
    });
    this.section.section_id = this.sectionForm.value.section_id;
    this.section.section_name = this.sectionForm.value.section_name;
    this.section.institution_id = this.user.institution_id;
    this.section.addedById = this.user.userId;
    this.section.addedByName = this.user.firstName + " " + this.user.lastName;
    this.section.addedDate = new Date().toISOString();
    this.section.modifiedById = this.user.userId;
    this.section.modifiedByName = this.user.firstName + " " + this.user.lastName;
    this.section.modifiedDate = new Date().toISOString();
    this.section.status = "active";
    this.section.isDeleted = false;
    console.log(this.sectionForm.value);
    console.log(this.section);

    this.dataService.add_Section("section", this.section)
      .then(async res => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Section Added/Updated',
          message: 'Section added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                this.sectionForm.reset();
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(async err => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Section not Added/Updated',
          message: 'Record not added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                //this.storage.set("loggedUser",this.user);
              }
            }
          ]
        });
        await alert.present();
      });
  }

  async submitSubject() {
    let loading = await this.loadingCtrl.create({
      message: 'Saving Subject Details...'
    });
    await loading.present();
    this.subject.subject_class_id = this.subjectForm.value.subject_class_id;
    this.classes.forEach((c, index) => {
      if (c.keyId === this.subject.subject_class_id) {
        this.subject.class_id = c.class_id;
      }
    });
    this.subject.subject_id = this.subjectForm.value.subject_id;
    this.subject.subject_name = this.subjectForm.value.subject_name;
    this.subject.institution_id = this.user.institution_id;
    this.subject.addedById = this.user.userId;
    this.subject.addedByName = this.user.firstName + " " + this.user.lastName;
    this.subject.addedDate = new Date().toISOString();
    this.subject.modifiedById = this.user.userId;
    this.subject.modifiedByName = this.user.firstName + " " + this.user.lastName;
    this.subject.modifiedDate = new Date().toISOString();
    this.subject.status = "active";
    this.subject.isDeleted = false;
    console.log(this.subjectForm.value);
    console.log(this.subject);

    this.dataService.add_Record("subject", this.subject)
      .then(async res => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Subject Added/Updated',
          message: 'Subject added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                this.sectionForm.reset();
                this.navCtrl.navigateRoot('/subject');
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(async err => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Subject not Added/Updated',
          message: 'Record not added/updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                //this.storage.set("loggedUser",this.user);
              }
            }
          ]
        });
        await alert.present();
      });
  }

}
