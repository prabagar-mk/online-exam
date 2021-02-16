import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
//import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  onLoginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    //private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    public storage: Storage,
  ) { }
  ionViewWillEnter() {
    //this.menuCtrl.enable(false);
  }
  ngOnInit() {
    // let question = {
    //   institution_id: "1",
    //   uniqueTest_id: "001",
    //   test_name: "Test Exam One",
    //   test_date: new Date().toISOString(),
    //   class_id: "06",
    //   section_id: "01",
    //   subject_id: "01",
    //   no_of_questions: 3,
    //   total_marks: 6,
    //   questions: [
    //     {
    //       question_no: 1,
    //       question: "What is your name?",
    //       question_type: "fill_blank",
    //       correct_answer: "Prabagar",
    //       question_mark: 2
    //     },
    //     {
    //       question_no: 2,
    //       question: "How many colors does Indian flag has?",
    //       question_type: "optional",
    //       optional_answers: ["4", "3", "2"],
    //       correct_answer: "3",
    //       question_mark: 2
    //     },
    //     {
    //       question_no: 3,
    //       question: "What is the full form of JS?",
    //       question_type: "fill_blank",
    //       correct_answer: "Javascript",
    //       question_mark: 2
    //     }
    //   ],
    //   addedDate: new Date().toISOString(),
    //   addedById: "0000123",
    //   addedByName: "Prabha",
    //   modifiedById: "0000123",
    //   modifiedByName: "Prabha",
    //   modifiedDate: new Date().toISOString(),
    //   isDeleted: false,
    //   status: "active"
    // }
    // this.dataService.add_Record(question).then(res => {
    //   console.log(res);
    // })
    //   .catch(err => {
    //     console.log(err);
    //   });
    this.storage.get("loggedUser").then(user => {
      if (user) {
        console.log(user);
        let value = {
          email: user.email,
          password: atob(user.password)
        }
        this.tryLogin(value);
      } else {
        //
      }
    });
    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({

                message: 'Email was sent successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async tryLogin(value) {
    console.log(value);
    this.dataService.check_userLogin(value.email, btoa(value.password))
      .subscribe(res => {
        if (res[0]) {
          //console.log(res[0]);
          this.storage.set("loggedUser", res[0]);
          this.router.navigate(["/home"]);
        } else {
          // this.authService.doLogin(value).then(
          //   res => {
          //     //console.log(res.user);
          //     let user = {
          //       userId: res.user.uid,
          //       userName: res.user.email,
          //       password: btoa(value.password),
          //       email: res.user.email,
          //       emailVerified: res.user.emailVerified,
          //       phoneNumber: res.user.phoneNumber,
          //       firstName: "",
          //       lastName: "",
          //       fid: "",
          //       refreshToken: res.user.refreshToken
          //     };
          //     //console.log(user);
          //     this.dataService.get_user("users", user)
          //       .then(res => {
          //         if (res) {
          //           this.storage.set("loggedUser", res[0]);
          //           this.router.navigate(["/home"]);
          //         } else {
          //           alert("You are not an authorized user. Kindly contact the admin.")
          //         }
          //       })
          //       .catch(err => {
          //         console.log(err);
          //       });

          //   },
          //   err => {
          //     this.errorMessage = err.message;
          //     console.log(err);
          //   }
          // );
        }
      });

  }
  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

}
