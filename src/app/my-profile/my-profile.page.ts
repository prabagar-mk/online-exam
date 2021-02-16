import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from "moment";
import { DataService } from '../services/data.service';
import { ActionSheetController, IonContent, LoadingController, ModalController, ToastController, AlertController, NavController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  [x: string]: any;
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
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.capturedSnapURL = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }
  takeSnap() {
    this.camera.getPicture(this.cameraOptionsCam).then((imageData) => {
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
        if(this.user.user_img){
          this.capturedSnapURL = this.user.user_img;
        }else{
          this.capturedSnapURL = "../assets/img/placeholder.png";
        }
        this.registrationForm.patchValue(this.user);
      } else {
        this.navCtrl.navigateRoot('/login');
      }

    });
    
  }

  get firstName() {
    return this.registrationForm.get("firstName");
  }
  get lastName() {
    return this.registrationForm.get("lastName");
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get userName() {
    return this.registrationForm.get('userName');
  }
  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }
  get street() {
    return this.registrationForm.get('address.street');
  }
  get city() {

    return this.registrationForm.get('address.city');
  }
  get state() {
    return this.registrationForm.get('address.state');
  }
  get pincode() {
    return this.registrationForm.get('address.pincode');
  }
  public errorMessages = {
    firstName: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    lastName: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    userName: [
      { type: 'required', message: 'Username is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    phoneNumber: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' }
    ],
    street: [
      { type: 'required', message: 'Street name is required' },
      {
        type: 'maxlength',
        message: 'Street name cant be longer than 100 characters'
      }
    ],
    city: [
      { type: 'required', message: 'City name is required' },
      {
        type: 'maxlength',
        message: 'City name cant be longer than 100 characters'
      }
    ],
    state: [
      { type: 'required', message: 'State is required' },
      {
        type: 'maxlength',
        message: 'State cant be longer than 100 characters'
      }
    ],
    pincode: [
      { type: 'required', message: 'Pincode is required' },
      {
        type: 'pattern',
        message: 'Please enter a valid pincode'
      }
    ]
  };
  registrationForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],

    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    userName: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$')
      ]
    ],
    address: this.formBuilder.group({
      street: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      pincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{3}(?:[0-9]{3})?$')]
      ]
    })
  });

  async submit() {
    let loading = await this.loadingCtrl.create({
      message: 'Saving Profile...'
    });
    await loading.present();
    this.user.firstName = this.registrationForm.value.firstName;
    this.user.lastName = this.registrationForm.value.lastName;
    this.user.email = this.registrationForm.value.email;
    this.user.phoneNumber = this.registrationForm.value.phoneNumber;
    this.user.address = this.registrationForm.value.address;
    if(this.capturedSnapURL!==this.user.user_img){
      this.user.user_img = this.capturedSnapURL;
    }
    console.log(this.registrationForm.value);
    console.log(this.user);

    this.dataService.update_profile("users", this.user)
      .then(async res => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Profile Updated',
          message: 'Your profile details updated successfully..',
          buttons: [
            {
              text: 'Ok', role: 'cancel', cssClass: 'secondary', handler: () => {
                this.storage.set("loggedUser", this.user);
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(async err => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Profile not Updated',
          message: 'Your profile details not updated successfully..',
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

  async doRefresh(event: any) {    
    this.dataService.get_user("users", this.user)
      .then(res => {
        console.log(res);
        this.user = res;
        this.registrationForm.patchValue(this.user);
        this.storage.set("loggedUser",this.user).then(res => {
          event.target.complete();
        }).catch(err => {
          event.target.complete();
        });        
      }).catch(err => {
        console.log(err);
        event.target.complete();
      });    
  }

}
