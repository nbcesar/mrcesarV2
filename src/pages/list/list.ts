import { Component } from '@angular/core';
import { NavController, reorderArray } from 'ionic-angular';

import { User } from '../../providers/user';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public list: any = [];

  public filter: string = "all"

  constructor(
    public navCtrl: NavController,
    public userService: User,

  ) {

  }

  ionViewDidLoad() {
    this.userService.userList.subscribe(data => {
      for (var school in data) {
        if (school == 'updated') continue;
        this.list.push(data[school]);
      }
    });

  }

  toggleFilter(button) {
    this.filter = button;
  }

  reorderItems(indexes) {
    this.list = reorderArray(this.list, indexes);
    this.userService.updateList(this.list);
  }

}
