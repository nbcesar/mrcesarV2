import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';

import { User } from '../../providers/user';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public profile: any;
  public profileForm: any;

  constructor(
    public navCtrl: NavController,
    public userService: User,
    public formBuilder: FormBuilder,
  ) {

    this.profileForm = formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      state: [''],
      graduation: [''],
      counselor: [''],
      gpaScale: [''],
      gpa: '',
      test: [''],
      actC: [''],
      satM: [''],
      satR: [''],
      race: [''],
      familyIncome: [''],
      gender: [''],
      dob: [''],
      hsName: [''],
      hsCode: ['']
    });
    this.profileForm.valueChanges
      .debounceTime(2000)
      .subscribe(data => {
        //this.profileChanged = true;
        this.userService.saveProfile(data);
      });
  }

  ionViewDidLoad() {
    this.userService.userProfile.subscribe(data => {
      this.profile = data;
      if (data != null) {
        for (var control in data) {
          // skip over profile/updated
          if (control === 'updated') {
            continue;
          }
          else if (control === 'type') continue;
          this.profileForm.controls[control].patchValue(data[control], {
            emitEvent: false
          });
        }

      }
    });
  }

  logout() {
    this.userService.logout();
  }

}
