import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
import 'firebase/auth';
// import { FirebaseService } from './firebase.service';
// import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public storage: Storage
  ){}

  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.default.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }
  signupUser(firstName: string, lastName: string, gender: string, dob: Date, mobile: number, email: string, password: string, address1: string, address2: string, city:string, state: string, pincode: number): Promise<any> {
    return firebase
      .default.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.default.auth.UserCredential) => {
        console.log(newUserCredential.user.uid);
        firebase
          .default.firestore()
          .doc('/users/'+newUserCredential.user.uid)
          .set({ 
            userId: newUserCredential.user.uid, firstName, lastName, gender, dob, mobile, email, 
            address: { address1, address2, city, state, pincode},
            userType: 'healthcareWorker', userRole: 'healthcareWorker', isDeleted: false, status: 'active', addedDate: new Date(), 
            addedBy: firstName
          });
          let user = firebase.default.auth().currentUser;
          user.sendEmailVerification();
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }
  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     firebase.default.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(res => { 
       console.log(res);
       resolve(res);
     })
    .catch(err => {
      reject(err);
    });
   });
  }
  resetPassword(email: string): Promise<any> {
    return firebase
      .default.auth()
      .sendPasswordResetEmail(email)
      .then((res) => {
        console.log(res);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }
  doLogout():Promise<void> {
    this.storage.remove('loggedUser');
    return firebase.default.auth().signOut();
  }
}
