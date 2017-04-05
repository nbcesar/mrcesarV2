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
      for (var school in data) {
        if (school == 'updated') continue;
        if (this.collegeOdds) {
          let admit = this.collegeOdds[school] || 'safety';
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
          data[school]['admit'] = admit;
          data[school]['icon'] = icon;
        }
        this.list.push(data[school]);
      }
      this.list.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);} );
      this.filteredList = this.list;
    });

  }

  toggleFilter(button) {
    // If filter == 'all', reorder
    if (button == 'all') {
      this.filteredList = this.list;
      this.reOrder = true;
    }
    else {
      this.filteredList = this.list.filter(school => {
        return school['admit'] == button;
      });
      this.reOrder = false;
    }

    this.filter = button;

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
