import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Subject, ReplaySubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import firebase from 'firebase';

/*
 * User Service - Offline First using Ionic Storage & Firebase
 * When 1st started - check local storage for user data
 * - If available, return local data
 * Check for connection to FB
 * - Get data using .on('value') & compare to local data
 *    - If newer, return new data
 *
 * When user changes data, update local first and send to FB
 * - Use new updated timestamp
 */

@Injectable()
export class User {

  public currentUser: Object;

  public allData = [];
  
  // Firebase refs
  public profileRef: any;
  public listRef: any;

  // User data observables
  public userProfile:ReplaySubject<any> = new ReplaySubject(1);
  public userList:ReplaySubject<any> = new ReplaySubject(1);
  // public userProfile:Subject<any> = new Subject();
  // public userList:Subject<any> = new Subject();

  constructor(
    public storage: Storage,
    public platform: Platform,
    public http: Http
  ) {
    // Initialize firebase refs when user is signed in
    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        // Get user info and FB refs
        this.currentUser = firebase.auth().currentUser;
        this.profileRef = firebase.database().ref('/users').child(this.currentUser['uid']).child('profile');
        this.listRef = firebase.database().ref('/users').child(this.currentUser['uid']).child('myList');
        // Get profile information
        this.storage.get('profile').then(data => {
          // Send local profile to userProfile
          this.userProfile.next(data);
          // Get FB profile
          this.getFBProfile(data);
        });
        // Get list information
        this.storage.get('list').then(data => {
          this.userList.next(data);
          this.getFBList(data);
        });
      }

    });

  }

  /*
   * Connect to FB to get user list
   * If firebase list is newer, send to userList
   */
   getFBList(localData) {
     this.listRef.on('value', list => {
       let fbList = list.val();
       // If no fb data, keep local
       if (fbList == null) {}
       // Compare to localData
       // if no localData - send firebase list & save local
       else if (localData == null || (localData.updated < fbList.updated)) {
         this.userList.next(fbList);
         this.storage.set('list', fbList);
       }
     })
   }

   // List was reorderd - save locally and to FB
   updateList(newList) {
     let listObj = {};
     newList.forEach(school => {
       listObj[school.unitid] = school;
     });
     listObj['updated'] = new Date().getTime();
     console.log(listObj);
   }
  /*
   * Connect to FB to get user profile
   * If firebase profile is newer, send to userProfile
   */
  getFBProfile(localData) {

    this.profileRef.on('value', profile => {
      let fbProfile = profile.val();
      // Compare to localData
      // if no localData - send firebase profile & save local
      if (localData == null || (localData.updated < fbProfile.updated)) {
        this.userProfile.next(fbProfile);
        this.storage.set('profile', fbProfile);
      }
      else {

      }

    });

  }

  saveProfile(data) {
    let updatedProfile = data;
    // Compare updated profile to local profile
    this.storage.get('profile').then(localData => {
      let localProfile = localData;

      for (var key in updatedProfile) {
        if (updatedProfile[key] !== localProfile[key]) {
          localProfile[key] = updatedProfile[key];
        }
      }
      // Add updated time
      localProfile.updated = new Date().getTime();
      // Update local data
      this.storage.set('profile', localProfile);
      // Update FB data - If no connection, data will be stored locally
      this.profileRef.update(localProfile);
    })





  }

  getLocalCollegeData() {
    this.http.get('assets/data/colleges.json')
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.allData = data;
      });
  }

  logout(): any {
    this.storage.clear();
    firebase.auth().signOut().then(() => {
      //window.location.reload();
    });

  }

  login(email: string, pw: string): any {
    return firebase.auth().signInWithEmailAndPassword(email, pw);
  }

}
