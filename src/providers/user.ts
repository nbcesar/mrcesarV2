import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs';
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

 // TODO: Get collegeOdds and make available to components

@Injectable()
export class User {

  public currentUser: Object;

  public allData = [];

  // Firebase refs
  public collegesRef = firebase.database().ref('/colleges');
  public profileRef: any;
  public listRef: any;
  public collegeOddsRef: any;

  // Local variables
  public localList;
  public remoteList;
  public collegeOdds;

  // User data observables
  public userProfile:ReplaySubject<any> = new ReplaySubject(1);
  public userList:ReplaySubject<any> = new ReplaySubject(1);
  public userOdds: ReplaySubject<any> = new ReplaySubject(1);

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
        this.collegeOddsRef = firebase.database().ref('/users').child(this.currentUser['uid']).child('collegeOdds');

        // Get collegeOdds
        this.getCollegeOdds();

        // Get profile information
        this.storage.get('profile').then(data => {
          // Send local profile to userProfile
          this.userProfile.next(data);
          // Get FB profile
          this.getFBProfile(data);
        });
        // Get List information
        this.getList();

      }

    });

  }

  getCollegeOdds() {
    this.collegeOddsRef.once('value', oddsSnap => {
      this.collegeOdds = oddsSnap.val();
      if (this.collegeOdds) {
        this.storage.set('odds', this.collegeOdds);
      }
      this.getLocalCollegeData();
    }, error => {
      console.log(error);
      this.storage.get('odds').then(odds => {
        if (odds) {
          this.collegeOdds = odds;
        }
        this.getLocalCollegeData();
      })
    });
  }

  getList() {

    this.listRef.on('value', listSnap => {
      this.remoteList = listSnap.val();
      this.storage.get('list').then(list => {
        this.localList = list;
        this.compareLists();
      });
    }, error => {
      this.storage.get('list').then(list => {
        this.localList = list;
        this.compareLists();
      });
    });

  }

  compareLists() {

    // If they both have data, compare updated dates
    if (!this.localList && !this.remoteList) {
      return;
    }
    // At least one has data
    if (!this.localList) {
      // No local data, pull fb data to device
      this.localList = this.remoteList;
      this.userList.next(this.remoteList);
      this.storage.set('list', this.remoteList);
    }
    else if (!this.remoteList) {
      // No remote data, push local data to fb
      this.userList.next(this.localList);
      this.listRef.set(this.localList);
    }
    else {
      // Compare the updated dates
      if (this.localList.updated < this.remoteList.updated) {
        // Local data is older
        this.userList.next(this.remoteList);
        this.storage.set('list', this.remoteList);
      }
      else {
        this.userList.next(this.localList);
      }
    }

  }

  // List was reorderd - save locally and to FB
  updateList(indexes) {
    this.getList();

    let from = indexes.from;
    let to = indexes.to;
    let moveDown: Boolean;
    if (from < to) moveDown = true;
    else moveDown = false;
    let newList = this.localList;
    for (var school in newList) {
      if (school == 'updated') continue;
      let order = newList[school].order;
      if (order == from) newList[school]['order'] = to;
      else if (order == to && moveDown) newList[school]['order'] = to - 1;
      else if (order == to && !moveDown) newList[school]['order'] = to + 1;
      else if (order > from && order < to) newList[school]['order'] = order - 1;
      else if (order > to && order < from) newList[school]['order'] = order + 1;
    }
    newList['updated'] = new Date().getTime();
    this.localList = newList;
    this.storage.set('list', newList).then(() => {
      this.userList.next(newList);
      this.listRef.set(newList);
    });
  }

  // Add school to list
  /*
  * Check if school already exists in list
  * If not
  *  - Add to local copy of list
  *
  */
  addSchoolToList(school) {
    // Make sure localList and remoteList are up to date
    //this.getList();
    var listLength;
    var newList = {};
    // Number of schools = length - 1
    if (this.localList) {
      // Check if in list
      if (this.localList.hasOwnProperty(school['unitid'])) return;
      // Get lenght of list
      listLength = Object.keys(this.localList).length;
      if (listLength > 0) listLength -= 1;
      else listLength = 0;

      newList = this.localList;
    }
    else {
      listLength = 0;
    }
    // Prepare newList with new school
    newList['updated'] = new Date().getTime();
    let id = school['unitid'];
    newList[id] = school;
    newList[id].order = listLength;

    this.storage.set('list', newList).then(() => {
      this.userList.next(newList);
      this.listRef.set(newList);
    });
  }

  removeSchoolFromList(school) {
    // Make sure localList and remoteList are up to date
    //this.getList();

    let newList = this.localList;
    newList['updated'] = new Date().getTime();
    // Get order of school
    let order = newList[school.unitid]['order'];

    //Update the order of every school below order
    for (var college in newList) {
      if (college == 'updated') continue;
      if (newList[college].order > order) {
        newList[college].order -= 1;
      }
    }
    delete newList[school['unitid']];
    this.storage.set('list', newList).then(() => {
      this.userList.next(newList);
      this.listRef.set(newList);
    });
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
        // Local data is newer than FB data - updated FB data
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
    });
  }

  getLocalCollegeData() {
    this.http.get('assets/data/colleges.json')
      .map(res => res.json())
      .subscribe(data => {
        if (this.collegeOdds) {
          data.forEach(college => {
            let admit = this.collegeOdds[college['unitid']] || 'safety';
            var icon;
            switch (admit) {
              case 'moonshot':
                icon = "star-half"
                break;
              case 'reach':
                icon = "flag"
                break;
              case 'target':
                icon = "locate"
                break;
              default:
                icon = "warning"
            }
            college['admit'] = admit;
            college['icon'] = icon;
          });
        }

        this.allData = data;
      });
  }

  logout(): any {
    this.storage.clear().then(() => {
      firebase.auth().signOut();
    });
  }

  login(email: string, pw: string): any {
    return firebase.auth().signInWithEmailAndPassword(email, pw);
  }


  getCollege(id): Promise<any> {
    let collegeData: Object;
    return new Promise((resolve, reject) => {
      let connectedRef = firebase.database().ref(".info/connected");
      connectedRef.once("value", snap => {
        if (snap.val() === true) {
          //alert("connected");
          this.collegesRef.child(id).once('value', snapshot => {
            collegeData = snapshot.val();
            collegeData['unitid'] = snapshot.key;
            this.storage.set(id.toString(), collegeData);
            resolve(collegeData);
            return false;
          }, function(error) {
            console.error(error);
          });
        } else {
          //alert("not connected");
          this.storage.get(id.toString()).then(data => {
            if (data) {
              resolve(data);
            }
            else {
              resolve('error');
            }
          });
        }
      });

      //resolve(collegeData);
    });
  }

}
