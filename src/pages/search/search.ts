import { Component, ViewChild } from '@angular/core';
import { NavController, Searchbar, ModalController, NavParams } from 'ionic-angular';

import { SearchFiltersPage } from '../search-filters/search-filters';

import { User } from '../../providers/user';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  @ViewChild(Searchbar) searchEl: Searchbar;

  public search: boolean = false;
  public filters: Object = {
    states:  [],
    majors:  [],
    college_control:  "all",
    college_gender:  "all",
    college_type:  "all",
    college_degree:  "all",
    showResults:  false,
    test_optional:  false,
    liberal_arts:  false
  };
  public filteredColleges = [];

  constructor(
    public navCtrl: NavController,
    public userService: User,
    public modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.userService.getLocalCollegeData();
  }

  getColleges(searchbar?) {
    let query:any = this.searchEl.value;

    if (searchbar && query.length < 3) {
      this.search = false;
      this.filteredColleges = [];
      return;
    }

    this.filteredColleges = this.userService.allData.filter((v) => {
      this.search = true;

      if (
          // query/searchbar in college name
          v.instnm.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
          // filters by state if states are checked
          (this.filters['states'].length == 0 || this.filters['states'].indexOf(v.state)) > -1 &&
          // filters by degree
          (this.filters['college_degree'] == 'all' || this.filters['college_degree'] == v.preddeg) &&
          // filters by control (public / private)
          (this.filters['college_control'] == 'all' || this.filters['college_control'] == v.control) &&
          // filter by gender
          (this.filters['college_gender'] == 'all' || v[this.filters['college_gender']] == 1) &&
          // filter by cultural_type
          (this.filters['college_type'] == 'all' || v[this.filters['college_type']] == 1) &&
          // filter by liberal_arts
          (!this.filters['liberal_arts'] || v.liberal_arts) &&
          // filter by test_optional
          (!this.filters['test_optional'] || v.test_optional)
        ) {
          if (this.filters['majors'].length > 0) {
            let hasMajors = true;
            for (var i = 0; i < this.filters['majors'].length; i++) {
              let major = this.filters['majors'][i].toLowerCase();
              if (!v[major]) hasMajors = false;
            }
            if (hasMajors) return true;
            else return false;
          }
          return true;
        }
        else {
          return false;
        }
    });

    this.filteredColleges.sort(function compare(a,b) {
      if (a.grad_rate < b.grad_rate)
        return 1;
      if (a.grad_rate > b.grad_rate)
        return -1;
      return 0;
    });

    this.filteredColleges = this.filteredColleges.slice(0,99);

  }

  clearSearch() {
    this.search = false;
  }

  openFilters() {
    let filtersModal = this.modalCtrl.create(SearchFiltersPage, {filters: this.filters});
    filtersModal.onDidDismiss(data => {
      console.log(data);
      this.filters = data.filters;
      if (data.search) this.getColleges();
      else {
        this.filteredColleges = [];
      }
    });
    filtersModal.present();
  }

}