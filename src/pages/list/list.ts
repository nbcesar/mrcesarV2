import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { CollegeDetailPage } from '../college-detail/college-detail';

import { User } from '../../providers/user';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public list: any = [];
  public filteredList: any = [];
  public filter: string = "all";

  public reOrder: boolean = true;
  public listOptions: boolean = false;

  public collegeOdds: Object;

  public progress = 0;
  public list_progress = [0,0,0,0]; // The number of schools in each category
  public list_message: string = "Build a Balanced List - Get to 100%";

  constructor(
    public navCtrl: NavController,
    public userService: User,
    public alertCtrl: AlertController
  ) {


  }

  ionViewDidLoad() {
    // Get college odds and add to each school
    this.collegeOdds = this.userService.collegeOdds;
    // Subscribe to user's list
    this.userService.userList.subscribe(data => {
      this.list = [];
      this.list_progress = [0,0,0,0];
      for (var school in data) {
        if (school == 'updated') continue;
        if (this.collegeOdds) {
          let admit = this.collegeOdds[school] || 'safety';
          var icon;
          switch (admit) {
            case 'moonshot':
              icon = "star-half";
              this.list_progress[0]++;
              break;
            case 'reach':
              icon = "flag";
              this.list_progress[1]++;
              break;
            case 'target':
              icon = "locate";
              this.list_progress[2]++;
              break;
            default:
              icon = "warning";
              this.list_progress[3]++;
          }
          data[school]['admit'] = admit;
          data[school]['icon'] = icon;
          this.calculateListProgress();
        }
        this.list.push(data[school]);
      }
      this.list.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);} );
      if (this.filter == 'all') this.filteredList = this.list;
      else this.filterSchools();
    });

  }

  filterSchools() {
    this.filteredList = this.list.filter(school => {
      return school['admit'] == this.filter;
    });
  }

  calculateListProgress() {
    this.progress = 0;
    // Moonshot
    if (this.list_progress[0] > 0) this.progress += 15;
    // Reach
    if (this.list_progress[1] > 0 && this.list_progress[1] < 4) this.progress += (10 * this.list_progress[1]);
    else if (this.list_progress[1] > 3) this.progress += 30;
    // Target
    if (this.list_progress[2] > 0 && this.list_progress[2] < 4) this.progress += (10 * this.list_progress[2]);
    else if (this.list_progress[2] > 3) this.progress += 30;
    // Safety
    if (this.list_progress[3] == 1) this.progress += 10;
    else if (this.list_progress[3] > 1) this.progress += 25;
  }

  toggleFilter(button) {
    // If filter == 'all', reorder
    this.filter = button;
    if (button == 'all') {
      this.filteredList = this.list;
      this.reOrder = true;
    }
    else {
      this.filterSchools();
      this.reOrder = false;
    }


    // Update list message
    if (this.filter == 'all' && this.progress < 100) {
      this.list_message = 'Build a Balanced List - Get to 100%';
    }
    else if (this.filter == 'all' && this.progress == 100) {
      this.list_message = 'Great job - You have a balanced list.';
    }
    else if (this.filter == 'moonshot' && this.progress < 100) {
      let schools = this.list_progress[0];
      if (schools > 0) this.list_message = 'Moonshots - All set. Check the others.'
      else this.list_message = `Moonshots - Add at least 1 moonshot school.`;
    }
    else if (this.filter == 'reach' && this.progress < 100) {
      let schools = this.list_progress[1];
      if (schools > 2) this.list_message = 'Reach - All set. Check the others.'
      else this.list_message = `Reach - Add ${3 - schools} more reach schools.`;
    }
    else if (this.filter == 'target' && this.progress < 100) {
      let schools = this.list_progress[2];
      if (schools > 2) this.list_message = 'Target - All set. Check the others.'
      else this.list_message = `Target - Add ${3 - schools} target schools.`;
    }
    else if (this.filter == 'safety' && this.progress < 100) {
      let schools = this.list_progress[3];
      if (schools > 1) this.list_message = 'Safety - All set. Check the others.'
      else this.list_message = `Safety - Add ${2 - schools} safety schools.`;
    }



  }

  reorderItems(indexes) {
    this.userService.updateList(indexes);
  }

  goToCollege(id) {
    this.userService.getCollege(id)
    .then(collegeData => {
      if (collegeData != 'error') {
        this.navCtrl.push(CollegeDetailPage, {
          collegeData: collegeData
        });
      }
      // Set up alert
      else {
        let alert = this.alertCtrl.create({
          title: 'No Connection',
          subTitle: 'Sorry, no connection available.',
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  toggleListOptions() {
    //this.reOrder = !this.reOrder;
    this.listOptions = !this.listOptions
  }

  removeSchool(school) {
    this.userService.removeSchoolFromList(school);
  }

}
