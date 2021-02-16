import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss'],
})
export class InstitutionDetailsPage implements OnInit {
  [x: string]: any;
  institution: any = {};

  capturedSnapURL: string;
  cameraOptionsCam: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }
  cameraOptionsGal: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
  }
  constructor(public storage: Storage,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private dataService: DataService,
    public navCtrl: NavController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController) {

  }

  async getImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Click Pic',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.takeSnap();
        }
      }, {
        text: 'Choose Pic',
        icon: 'image',
        role: 'cancel',
        handler: () => {
          this.choosePicture();
        }
      }]
    });
    await actionSheet.present();
  }


  choosePicture() {

    this.camera.getPicture(this.cameraOptionsGal).then((imageData) => {
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.capturedSnapURL = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }
  takeSnap() {

    this.camera.getPicture(this.cameraOptionsCam).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.capturedSnapURL = base64Image;
    }, (err) => {
      // Handle error
    });
  }
  ngOnInit() {
    this.storage.get("loggedUser").then(res => {
      if (res) {
        this.user = res;
        console.log(this.user);
        this.dataService.getInstitution("institution", this.user.institution_id)
          .then(res => {
            console.log(res);
            this.institution = res;
            if (this.institution.institution_img) {
              this.capturedSnapURL = this.institution.institution_img;
            } else {
              this.capturedSnapURL = "../assets/img/placeholder.png";
            }
            this.institutionForm.patchValue(this.institution);
          })
          .catch(err => {
            console.log(err)
          });

      } else {
        this.navCtrl.navigateRoot('/login');
      }

    });
  }

  get institution_name() {
    return this.institutionForm.get("institution_name");
  }
  get institution_reg_no() {
    return this.institutionForm.get("institution_reg_no");
  }
  get institution_email() {
    return this.institutionForm.get("institution_email");
  }
  get institution_phoneNumber() {
    return this.institutionForm.get("institution_phoneNumber");
  }
  get address1() {
    return this.institutionForm.get("institution_address.address1");
  }
  get address2() {
    return this.institutionForm.get("institution_address.address2");
  }
  get town_city() {
    return this.institutionForm.get("institution_address.town_city");
  }
  get state() {
    return this.institutionForm.get("institution_address.state");
  }
  get pincode() {
    return this.institutionForm.get("institution_address.pincode");
  }

  public errorMessages = {
    institution_name: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    institution_reg_no: [
      { type: 'required', message: 'Reg No. is required' },
      { type: 'pattern', message: 'Please enter a valid Reg No.' }
    ],
    institution_email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    institution_phoneNumber: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' }
    ],
    address1: [
      { type: 'required', message: 'Address is required' }
    ],
    town_city: [
      { type: 'required', message: 'Town or City name is required' }
    ],
    state: [
      { type: 'required', message: 'State is required' }
    ],
    pincode: [
      { type: 'required', message: 'Pincode is required' },
      {
        type: 'pattern',
        message: 'Please enter a valid pincode'
      }
    ]
  };

  institutionForm = this.formBuilder.group({
    institution_name: ['', [Validators.required]],
    institution_reg_no: ['', [Validators.required]],
    institution_email: [
      '', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    institution_phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$')
      ]
    ],
    institution_address: this.formBuilder.group({
      address1: ['', [Validators.required, Validators.maxLength(50)]],
      address2: ['', [Validators.nullValidator]],
      town_city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      pincode: [
        '', [Validators.required, Validators.pattern('^[0-9]{3}(?:[0-9]{3})?$')]
      ]
    })
  });

  async submit() {
    let loading = await this.loadingCtrl.create({
      message: 'Saving Institution Details...'
    });
    await loading.present();
    console.log(this.institutionForm.value);
    this.institution.institution_reg_no = this.institutionForm.value.institution_reg_no;
    this.institution.institution_name = this.institutionForm.value.institution_name;
    this.institution.institution_email = this.institutionForm.value.institution_email;
    this.institution.institution_phoneNumber = this.institutionForm.value.institution_phoneNumber;
    this.institution.institution_address.address1 = this.institutionForm.value.institution_address.address1;
    this.institution.institution_address.address2 = this.institutionForm.value.institution_address.address2;
    this.institution.institution_address.town_city = this.institutionForm.value.institution_address.town_city;
    this.institution.institution_address.state = this.institutionForm.value.institution_address.state;
    this.institution.institution_address.pincode = this.institutionForm.value.institution_address.pincode;
    this.institution.modifiedById = this.user.userId;
    this.institution.modifiedByName = this.user.firstName + " " + this.user.lastName;
    this.institution.modifiedDate = new Date().toISOString();
    if (this.capturedSnapURL !== this.institution.institution_img) {
      this.institution.institution_img = this.capturedSnapURL;
    }
    console.log(this.institution);

    this.dataService.update_record("institution", this.institution)
      .then(async res => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Institution Updated',
          message: 'Institution details updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                //
              }
            }
          ]
        });
        await alert.present();
      })
      .catch(err => {
        loading.dismiss();
        console.log(err);
      })
  }

  async doRefresh(event: any) {
    this.dataService.getInstitution("institution", this.user.institution_id)
      .then(res => {
        console.log(res);
        this.institution = res;
        if (this.institution.institution_img) {
          this.capturedSnapURL = this.institution.institution_img;
        } else {
          this.capturedSnapURL = "../assets/img/placeholder.png";
        }
        this.institutionForm.patchValue(this.institution);
        event.target.complete();
      })
      .catch(err => {
        console.log(err);
        event.target.complete();
      });
  }

}
