import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'url';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public authenticated: boolean;
  public student: any = [];
  private login: boolean = false;
  private loginSubject$ = new BehaviorSubject<boolean>(this.login);
  loginChanged$ = this.loginSubject$.asObservable();
  public authPerson$ = new BehaviorSubject<object>(this.student);
  authPersonC$ = this.authPerson$.asObservable();


  private data = [];
  retarray: any = [];
  constructor(
    private firestore: AngularFirestore,
    public storage: Storage
  ) {
    this.storage.get("loggedUser").then((v) => {
      //console.log("Platforms: ", this.plt.platforms());
      if (v) {
        this.student = v;
      }
    });
  }
  updateLogin() {
    this.login = !this.login;
    //this.loginSubject$.next(this.login);
  }
  check_userLogin(uid, pwd) {
    let userData = this.firestore.collection('users', ref => ref
      .where('userName', '==', uid)
      .where('password', '==', pwd).limit(1)).valueChanges();
    this.student = userData;
    this.authPerson$.next(this.student);
    return userData;
  }

  check_userLogin1(uid, pwd) {
    let retArr = {};
    return new Promise((resolve, reject) => {
      this.firestore.collection("users", ref => ref
        .where('userName', '==', uid)
        .where('password', '==', pwd).limit(1)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                this.storage.set("loggedUser", d.data()).then(result => {
                  this.student = d.data();
                  this.authPerson$.next(d.data());
                  resolve(d.data());
                });

              });
            } else {
              resolve(retArr);
            }
          } else {
            resolve(retArr);
          }
        });
    });
  }

  add_Record(collection, record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).add(record).then(res => {
        console.log(res);
        this.firestore.collection(collection).doc(res.id).update({ keyId: res.id }).then(res => {
          resolve("Record Added Successfully.");
        }).catch(err => {
          reject(err);
        });

      });
    });
  }
  add_Section(collection, record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection("class").doc(record.section_class_id)
        .collection(collection).add(record).then(res => {
          console.log(res);
          this.firestore.collection("class").doc(record.section_class_id)
            .collection(collection).doc(res.id).update({ keyId: res.id }).then(res => {
              resolve("Record Added Successfully.");
            }).catch(err => {
              reject(err);
            });

        });
    });
  }
  get_tests(id) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("questions", ref => ref
        .where("institution_id", "==", id)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          } else {
            resolve(retArr);
          }
        });
    });
  }
  get_class_tests(c, s, i) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("questions", ref => ref
        .where('test_class_id', '==', c)
        .where('test_subject_id', '==', s)
        .where('institution_id', '==', i)
        .where('status', '==', 'active')).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          }
        });
    });
  }
  getInstitution(collection, id) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(id).get()
        .forEach(res => {
          resolve(res.data());
        });
    });
  }
  get_classes(collection, ins_id) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref
        .where('institution_id', '==', ins_id)
        .orderBy('class_id', 'asc')).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          }
        });
    });
  }
  get_class_sections(keyid) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("class").doc(keyid)
        .collection("section", ref => ref
          .orderBy('section_id', 'asc')).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          }
        });
    });
  }
  get_class_subjects(keyid, ins_id) {
    console.log(keyid);
    console.log(ins_id);
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("subject", ref => ref
        .where('subject_class_id', '==', keyid)
        .where('institution_id', '==', ins_id)
        .orderBy('subject_id', 'asc')).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            console.log(data);
            if (data.length > 0) {
              data.forEach((d, index) => {
                console.log(d.data());
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          }
        });
    });
  }

  get_records(collection) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            if (data.length > 0) {
              data.forEach((d, index) => {
                retArr.push(d.data());
                if (index === data.length - 1) {
                  resolve(retArr);
                }
              });
            } else {
              resolve(retArr);
            }
          }
        });
    });
  }
  upload_test_questions(id, record) {
    return new Promise((resolve, reject) => {
      this.firestore.collection("questions").doc(id).update(record).then(res => {
        resolve("Questions uploaded successfully.");
      }).catch(err => {
        reject(err);
      });
    });
  }
  doLogout() {
    return new Promise((resolve, reject) => {
      this.storage.remove("loggedUser").then(res => {
        this.storage.clear().then(res1 => {
          resolve("You are logged out..");
        }).catch(err1 => {
          reject(err1);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }










  checkareaCode(acode) {
    console.log(acode);
    return new Promise((resolve, reject) => {
      this.firestore.collection("areas", ref => ref.where('areaCode', '==', acode)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let rec = res.docs[doc].data();
              if (rec) {
                resolve(rec);
              }
            }
          } else {
            resolve("No record found.");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  checkstreetCode(areaKey, acode) {
    console.log(acode);
    return new Promise((resolve, reject) => {
      this.firestore.collection("areas").doc(areaKey)
        .collection("streets", ref => ref.where('streetCode', '==', acode)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let rec = res.docs[doc].data();
              if (rec) {
                resolve(rec);
              }
            }
          } else {
            resolve("No record found.");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  updateStreetKey() {
    return new Promise((resolve, reject) => {
      this.firestore.collection('areas', ref => ref
        .where('areaCode', '==', 114))
        .valueChanges().forEach(res => {
          if (res && res.length > 0) {
            for (let a = 0; a < res.length; a++) {
              let areaData: any = res[a];
              console.log(areaData);
              let key = areaData.keyId;
              this.firestore.collection("areas").doc(key)
                .collection("streets")
                .get().forEach(sres => {
                  for (let s = 0; s < sres.docs.length; s++) {
                    let stkey = sres.docs[s].id;
                    console.log(stkey);
                    console.log(sres.docs[s].data());
                    let streetData: any = sres.docs[s].data();
                    streetData.keyId = stkey;
                    console.log(streetData);
                    this.firestore.collection("areas").doc(key)
                      .collection("streets").doc(stkey)
                      .update(streetData);
                  }
                });
              //resolve(res[a]);
            }
          } else {
            //resolve(data);
          }
        });
    });
  }
  update_Streets(collection, recordId) {
    let retArray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(recordId)
        .collection("streets")
        .get().forEach(sres => {
          for (let s = 0; s < sres.docs.length; s++) {
            let stkey = sres.docs[s].id;
            console.log(stkey);
            console.log(sres.docs[s].data());
            let streetData: any = sres.docs[s].data();
            console.log(streetData);
            retArray.push(streetData);
            if (s === sres.docs.length - 1) {
              resolve(retArray);
            }
          }
        });
    });
  }
  get_familyMembersList(familyid) {
    let retArray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("familyMembershdss", ref => ref
        .where('id', '==', familyid))
        .get().forEach(sres => {
          for (let s = 0; s < sres.docs.length; s++) {
            let stkey = sres.docs[s].id;
            console.log(stkey);
            console.log(sres.docs[s].data());
            let streetData: any = sres.docs[s].data();
            console.log(streetData);
            retArray.push(streetData);
            if (s === sres.docs.length - 1) {
              resolve(retArray);
            }
          }
        });
    });
  }
  updateAreaStreet(aid, sid, rec) {
    return new Promise((resolve, reject) => {
      this.firestore.collection("areas").doc(aid)
        .collection("streets").doc(sid)
        .update(rec)
        .then(result => {
          resolve("Street " + sid + " updated");
        });
    });
  }
  add_Family(record) {
    console.log(record);
    record.keyId = record.userId;
    return new Promise((resolve, reject) => {
      this.firestore.collection('familiesNew').doc(record.userId).set(record).then(res => {
        console.log(res);
        resolve("Family Details Added Successfully");
      });
    });
  }
  get_familyVisitHistory(id) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection("familiesNew").doc(id)
        .collection("previousVisits").get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            res.docs.forEach((r, index) => {
              let rec = r.data();
              //if (rec && rec.status!=='migrated') {
              retArr.push(rec);
              //}
              if (index === res.docs.length - 1) {
                resolve(retArr);
              }
            });
          }
        });
    });
  }
  get_allFamilies() {
    return new Promise((resolve, reject) => {
      this.firestore.collection("familiesNew", ref => ref
        .where('place_of_survey', '==', 'Family')).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            let data = res.docs;
            resolve(data);
          }
        });
    });
  }
  update_familyMembersArray(rec) {
    let familyRecord;
    let individualRecord;
    return new Promise((resolve, reject) => {
      rec.familyMembers = [];
      // this.firestore.collection("familiesNew", ref => ref
      //   .where('place_of_survey', '==', 'Family')).get()
      //   .forEach(res => {
      // if (res.docs && res.docs.length > 0) {
      // res.docs.forEach((r, index) => {
      //   console.log(index);
      //   familyRecord = r.data();
      //   familyRecord.familyMembers = [];
      this.firestore.collection("familyMembershdss", ref => ref
        .where('id', '==', rec.keyId)).get()
        .forEach(res1 => {
          if (res1.docs && res1.docs.length > 0) {
            console.log(res1.docs.length);
            res1.docs.forEach((re, index) => {
              individualRecord = re.data();
              console.log(individualRecord);
              let member = {
                "keyId": individualRecord.individual_id,
                "individual_id": individualRecord.individual_id,
                "person_id": individualRecord.person_id,
                "name": individualRecord.name,
                "dob": individualRecord.dob,
                "age": individualRecord.age,
                "relation_hh": individualRecord.relation_hh
              };
              console.log(member);
              rec.familyMembers.push(member);
              individualRecord.status = "active";
              individualRecord.isDeleted = "false";
              individualRecord.addedBy = "admin";
              individualRecord.modifiedBy = "admin";
              individualRecord.addedDate = rec.doi;
              individualRecord.modifiedDate = new Date().toISOString();
              //this.firestore.collection('familyMembershdss').doc(individualRecord.keyId).update(individualRecord);
              if (index === res1.docs.length - 1) {
                rec.status = "active";
                rec.isDeleted = "false";
                rec.addedBy = "admin";
                rec.modifiedBy = "admin";
                rec.addedDate = rec.doi;
                rec.modifiedDate = new Date().toISOString();
                console.log(rec.familyMembers);
                this.firestore.collection('familiesNew').doc(rec.keyId).update(rec);
              }

            });
          } else {
            //
          }
        })
        .catch(err => {
          reject(err);
        });
      // });
      // } else {
      //   //
      // }
      // })
      // .catch(err => {
      //   reject(err);
      // });
    });
  }
  addFamilyMember(frecord, record) {
    console.log(record);
    record.keyId = record.individual_id;
    let fmemberData = {
      age: record.age,
      dob: record.dob,
      individual_id: record.individual_id,
      keyId: record.keyId,
      name: record.name,
      person_id: record.person_id,
      relation_hh: record.relation_hh,
      surveyCompleted: record.completed
    };
    if (frecord.familyMembers && frecord.familyMembers.length > 0) {
      frecord.familyMembers.push(fmemberData);
    } else {
      frecord.familyMembers = [{
        age: record.age,
        dob: record.dob,
        individual_id: record.individual_id,
        keyId: record.keyId,
        name: record.name,
        person_id: record.person_id,
        relation_hh: record.relation_hh,
        surveyCompleted: record.completed
      }];
    }
    return new Promise((resolve, reject) => {
      this.firestore.collection("familyMembershdss").doc(record.keyId).set(record).then(res => {
        this.firestore.collection("familiesNew").doc(frecord.keyId).update(frecord).then(res1 => {
          this.storage.set("family", frecord).then(res => {
            resolve("Member Data " + res + "inserted Successfully and the members list updated in the family record.");
          })
            .catch(err => {
              resolve("Family details not updated correctly.");
            });

        })
          .catch(err1 => {
            reject(err1);
          });

      })
        .catch(err1 => {
          reject(err1);
        });
    });
  }
  add_familyMember(record) {
    console.log(record);
    record.keyId = record.individual_id;
    return new Promise((resolve, reject) => {
      this.firestore.collection("familiesNew", ref => ref.where('keyId', '==', record.id)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let rec = res.docs[doc].data();
              if (rec) {

                // this.firestore.collection("familyMembershdss").doc(record.individual_id).set(record).then(res => {
                //   resolve(res);
                // })
                //   .catch(err1 => {
                //     reject(err1);
                //   });

              }
            }
          } else {
            //
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  update_family(collection, oldrecord, newrecord) {
    console.log(collection);
    console.log("old record");
    console.log(oldrecord);
    console.log("new record");
    console.log(newrecord);
    return new Promise((resolve, reject) => {
      console.log("Inside promise");
      this.firestore.collection(collection).doc(newrecord.keyId).update(newrecord)
        .then(res => {
          this.firestore.collection(collection).doc(oldrecord.keyId)
            .collection("previousVisits").add(oldrecord).then(res => {
              resolve("Record " + newrecord.keyId + " updated Successfully with the previous visit data " + res);
            });
        })
        .catch(err => {
          console.log("Record " + newrecord.keyId + " not updated Successfully.");
          reject("Record " + newrecord.keyId + " not updated Successfully.");
        })
    });
  }

  update_hh_member(collection, record) {
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(record.keyId).update(record)
        .then(res => {
          resolve("Record " + record.keyId + " updated Successfully.");
        })
        .catch(err => {
          reject("Record " + record.keyId + " not updated Successfully.");
        });
    });
  }
  update_member(collection, oldrecord, newrecord) {
    console.log(collection);
    console.log("old record");
    console.log(oldrecord);
    console.log("new record");
    console.log(newrecord);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(newrecord.keyId).update(newrecord)
        .then(res => {
          this.firestore.collection(collection).doc(oldrecord.keyId)
            .collection("previousVisits").add(oldrecord).then(res => {
              resolve("Record " + newrecord.keyId + " updated Successfully with the previous visit data " + res);
            });
        })
        .catch(err => {
          reject("Record " + newrecord.keyId + " not updated Successfully.");
        });
    });
  }
  insert_migratedFamily(collection, record) {
    console.log(collection);
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(record.keyId).set(record)
        .then(res => {
          console.log(res);
          resolve("Record " + record.keyId + " inserted Successfully.");
        })
        .catch(err => {
          reject("Record " + record.keyId + " not inserted Successfully.");
        })
    });
  }
  insert_migratedMember(collection, record) {
    console.log(collection);
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(record.keyId).set(record)
        .then(res => {
          console.log(res);
          resolve("Record " + record.keyId + " inserted Successfully.");
        })
        .catch(err => {
          reject("Record " + record.keyId + " not inserted Successfully.");
        })
    });
  }
  update_record(collection, record) {
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(record.keyId).update(record)
        .then(res => {
          resolve("Record " + record.keyId + " updated Successfully.");
        })
        .catch(err => {
          reject("Record " + record.keyId + " not updated Successfully.");
        })
    });
  }
  checkFid(wid) {
    return new Promise((resolve, reject) => {
      this.firestore.collection("users", ref => ref.where('fid', '==', wid)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let rec = res.docs[doc].data();
              if (rec) {
                resolve(rec);
              }
            }
          } else {
            resolve("No record found.");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  update_profile(collection, record) {
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(record.userId).update(record)
        .then(res => {
          resolve("Record " + record.userId + " updated Successfully.");
        })
        .catch(err => {
          // this.firestore.collection(collection).doc(record.userId).set(record).then(res => {
          //   resolve("Record "+ record.userId + " added successfully");
          // })
          // .catch(err => {
          //   reject("Record " + record.userId + " not added / updated Successfully.");
          // });
          reject("Record " + record.userId + " not updated Successfully.");
        })
    });
  }
  create_Area(collection, record) {
    let returnUniqueID;
    console.log(collection);
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).add(record).then(res => {
        console.log(res.id);
        let UpdateData = { keyId: res.id };
        this.firestore.doc('areas/' + res.id).update(UpdateData)
          .then(result => {
            resolve(UpdateData);
          });

      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

  }
  update_Area(collection, record) {
    let returnUniqueID;
    console.log(collection);
    console.log(record);
    return new Promise((resolve, reject) => {
      this.firestore.doc(collection + '/' + record.keyId).update(record).then(res => {
        resolve(record);
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

  }
  create_NewArea(arearecord, streetrecord) {
    let returnUniqueID;
    let streetKeys = [];
    console.log(arearecord);
    console.log(streetrecord);
    return new Promise((resolve, reject) => {
      this.firestore.collection('areas').add(arearecord).then(res => {
        console.log(res.id);
        let UpdateData = { keyId: res.id };
        this.firestore.doc('areas/' + res.id).update(UpdateData);
        if (streetrecord && streetrecord.length) {
          streetrecord.forEach((e, index) => {
            this.firestore
              .collection("areas").doc(res.id)
              .collection("streets").add(e)
              .then(res2 => {
                console.log(res2.id);
                let streetUpdateData = { keyId: res2.id };
                streetKeys.push(res2.id);
                this.firestore
                  .collection("areas").doc(res.id)
                  .collection("streets").doc(res2.id)
                  .update(streetUpdateData);
              })
              .catch(err2 => {
                console.log(err2);
              });
            if (index === streetrecord.length - 1) {
              resolve(streetKeys)
            }
          });
        } else {
          resolve(UpdateData);
        }
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

  }
  create_newStreet(arearecord, streetrecord) {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection("areas").doc(arearecord.keyId)
        .collection("streets").add(streetrecord)
        .then(res2 => {
          console.log(res2.id);
          let streetUpdateData = { keyId: res2.id };
          this.firestore
            .collection("areas").doc(arearecord.keyId)
            .collection("streets").doc(res2.id)
            .update(streetUpdateData)
            .then(resp => {
              resolve("New Street Added with id " + res2.id);
            });
        })
        .catch(err2 => {
          console.log(err2);
        });
    });

  }
  create_NewRecord(collection, record) {
    let returnUniqueID;
    return this.firestore.collection(collection).doc(record.userId).set(record).then(res => {
      return record;
    })
      .catch(err => {
        returnUniqueID = err;
        return returnUniqueID;
      });
  }
  get_user_details(collection, id) {
    console.log(id);
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref.where('keyId', '==', id)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let keyId = res.docs[doc].id;
              let rec = res.docs[doc].data();
              rec.keyId = keyId;
              if (rec) {
                resolve(rec);
              }
            }
          } else {
            reject(id);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  getCensusToday(uid) {
    console.log(uid);
    let retArray = [];
    let today = new Date();
    let today1 = moment(today).format("DD-MM-YYYY");
    return new Promise((resolve, reject) => {
      this.firestore.collection('familiesNew', ref => ref.where('modifiedById', '==', uid)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let modifiedDt = moment(res.docs[doc].data().modifiedDate).format("DD-MM-YYYY");
              console.log(modifiedDt);
              if (modifiedDt === today1) {
                retArray.push(res.docs[doc].data());
              }
              if (doc === res.docs.length - 1) {
                resolve(retArray);
              }
            }
          } else {
            reject(uid);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  get_user(collection, record) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref.where('userId', '==', record.userId)).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            for (let doc = 0; doc < res.docs.length; doc++) {
              let keyId = res.docs[doc].id;
              let rec = res.docs[doc].data();
              rec.keyId = keyId;
              if (rec) {
                resolve(rec);
              }
            }
          } else {
            this.create_NewRecord("users", record)
              .then(resp => {
                resolve(resp);
              })
              .catch(err => {
                reject(err);
              });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  get_families_waypoint(collection, a, s, waypoint) {
    console.log(collection);
    console.log(a);
    console.log(s);
    console.log(waypoint);
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection('familiesNew', ref => ref
        .where('areaId', '==', '252')
        .where('streetId', '==', '01')
        .where('waypoint', '==', '001')
      ).get().forEach(res => {
        console.log(res);
      });
      this.firestore.collection('familiesNew', ref => ref
        .where('areaId', '==', a)
        .where('streetId', '==', s)
        .where('waypoint', '==', waypoint)
      ).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            res.docs.forEach((r, index) => {
              let rec = r.data();
              //if (rec && rec.status!=='migrated') {
              retArr.push(rec);
              //}
              if (index === res.docs.length - 1) {
                resolve(retArr);
              }
            });
          } else {
            resolve(retArr);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  get_families(collection, areaId, streetId) {
    let retArr = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref
        .where('areaId', '==', areaId)
        .where('streetId', '==', streetId)
        .orderBy('waypoint', 'asc')
        // .orderBy('famid', 'asc')
      ).get()
        .forEach(res => {
          if (res.docs && res.docs.length > 0) {
            res.docs.forEach((r, index) => {
              let rec = r.data();
              if (rec && rec.status !== 'migrated') {
                retArr.push(rec);
              }
              if (index === res.docs.length - 1) {
                resolve(retArr);
              }
            });
          } else {
            resolve(retArr);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  setData(id, data) {
    this.data[id] = data;
  }

  getData(id) {
    return this.data[id];
  }
  get_area_details(a, s) {
    this.retarray = {};
    return new Promise((resolve, reject) => {
      this.firestore.collection("areas", ref => ref
        .where('areaCode', '==', a))
        .get().subscribe(result => {
          //console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            for (let a = 0; a < result.docs.length; a++) {
              this.retarray.area = result.docs[a].data();
              if (a === result.docs.length - 1) {
                this.firestore.collection("areas").doc(result.docs[a].data().keyId).collection("streets", ref => ref
                  .where('streetCode', '==', s))
                  .get().subscribe(result1 => {
                    //console.log(result.docs.length);
                    if (result1.docs && result1.docs.length > 0) {
                      for (let b = 0; b < result1.docs.length; b++) {
                        this.retarray.street = result1.docs[b].data();
                        if (b === result1.docs.length - 1) {

                          resolve(this.retarray);
                        }
                      }
                    } else {
                      resolve(this.retarray);
                    }

                  });

              }
            }
          } else {
            resolve(this.retarray);
          }

        });
    });
  }
  read_areaList(collection) {
    // this.read_user();
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref
        .where('isDeleted', '==', 'false')
        .orderBy('areaCode', 'asc'))
        .get().subscribe(result => {
          //console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            for (let a = 0; a < result.docs.length; a++) {
              this.retarray.push(result.docs[a].data());
              if (a === result.docs.length - 1) {
                resolve(this.retarray);
              }
            }
          } else {
            resolve(this.retarray);
          }

        });
    });
  }
  familyStreetChange() {
    console.log("familyStreetChange");
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection('familiesNew', ref => ref)
        .get().subscribe(result => {
          let documents = result.docs;
          if (documents.length > 0) {
            documents.forEach((doc, index) => {

              //if (doc.data().street_no && doc.data().street_no === '02') {
              this.retarray.push(doc.data());
              //}
              if (index === documents.length - 1) {
                resolve(this.retarray);
              }
            });
          }
        });
    });
  }
  read_familyMember(collection, id) {
    // this.read_user();
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection, ref => ref
        .where('individual_id', '==', id))
        .get().subscribe(result => {
          console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            for (let a = 0; a < result.docs.length; a++) {
              this.retarray.push(result.docs[a].data());
              if (a === result.docs.length - 1) {
                console.log(this.retarray);
                resolve(this.retarray);
              }
            }
          } else {
            resolve(this.retarray);
          }

        });
    });
  }
  get_area(aid, stid) {
    // this.read_user();
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection('areas', ref => ref
        .where('keyId', '==', aid))
        .get().subscribe(result => {
          console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            for (let a = 0; a < result.docs.length; a++) {
              this.retarray.push(result.docs[a].data());
              if (a === result.docs.length - 1) {
                console.log(this.retarray);
                this.firestore.collection('areas').doc(aid)
                  .collection("streets")
                  .get().subscribe(res => {
                    if (res.docs && res.docs.length > 0) {
                      for (let b = 0; b < res.docs.length; b++) {
                        if (res.docs[b].data().keyId === stid) {
                          this.retarray.push(res.docs[b].data());
                        }
                        if (b === res.docs.length - 1) {
                          resolve(this.retarray);
                        }
                      }
                    }
                  });


              }
            }
          } else {
            resolve(this.retarray);
          }

        });
    });
  }
  read_familyMember1(id) {
    // this.read_user();
    console.log(id);
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection('familyMembershdss', ref => ref
        .where('keyId', '==', id))
        .get().subscribe(result => {
          console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            this.retarray.push(result.docs[0].data());
            console.log(result.docs[0].data().name);
            resolve(result.docs[0].data());
          } else {
            resolve(this.retarray);
          }

        });
    });
  }
  read_streetList(collection, id) {
    // this.read_user();
    this.retarray = [];
    return new Promise((resolve, reject) => {
      this.firestore.collection(collection).doc(id)
        .collection('streets', ref => ref
          .where('isDeleted', '==', 'false')
          .orderBy('streetCode', 'asc'))
        .get().subscribe(result => {
          //console.log(result.docs.length);
          if (result.docs && result.docs.length > 0) {
            for (let a = 0; a < result.docs.length; a++) {
              this.retarray.push(result.docs[a].data());
              if (a === result.docs.length - 1) {
                resolve(this.retarray);
              }
            }
          } else {
            resolve(this.retarray);
          }

        });
    });
  }


}