import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the SearchFilters page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search-filters',
  templateUrl: 'search-filters.html'
})
export class SearchFiltersPage {

  public filters: Object;

  public states: string[] = [];
  public majors: string[] = [];
  public college_control = "all";
  public college_gender = "all";
  public college_type = "all";
  public college_degree = "all";
  public showResults = false;
  public test_optional = false;
  public liberal_arts = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    this.filters = this.navParams.get('filters');
    if (this.filters) {
      console.log('filters yes');
      this.states = this.filters['states'];
      this.majors = this.filters['majors'];
      this.college_control = this.filters['college_control'];
      this.college_gender = this.filters['college_gender'];
      this.college_type = this.filters['college_type'];
      this.college_degree = this.filters['college_degree'];
      this.showResults = this.filters['showResults'];
      this.test_optional = this.filters['test_optional'];
      this.liberal_arts = this.filters['liberal_arts'];
    }
    else {
      console.log('no filters');
    }
  }

  sendFilters() {
    this.viewCtrl.dismiss(
      {
        filters: {
          states: this.states,
          majors: this.majors,
          college_control: this.college_control,
          college_gender: this.college_gender,
          college_type: this.college_type,
          college_degree: this.college_degree,
          showResults: this.showResults,
          test_optional: this.test_optional,
          liberal_arts: this.liberal_arts
        },
        search: true
    });
  }

  dismiss() {
    this.states = [];
    this.majors = [];
    this.college_control = "all";
    this.college_gender = "all";
    this.college_type = "all";
    this.college_degree = "all";
    this.showResults = false;
    this.test_optional = false;
    this.liberal_arts = false;
    this.viewCtrl.dismiss({
      filters: {
        states: this.states,
        majors: this.majors,
        college_control: this.college_control,
        college_gender: this.college_gender,
        college_type: this.college_type,
        college_degree: this.college_degree,
        showResults: this.showResults,
        test_optional: this.test_optional,
        liberal_arts: this.liberal_arts
      },
      search: false
    });
  }



  public majorsList = [
    ["PCIP01", "Agriculture, Agriculture Operations, and Related Sciences"],
    ["PCIP04", "Architecture and Related Services"],
    ["PCIP05", "Area, Ethnic, Cultural, Gender, and Group Studies"],
    ["PCIP26", "Biological and Biomedical Sciences"],
    ["PCIP52", "Business, Management, Marketing, and Related Support Services"],
    ["PCIP09", "Communication, Journalism, and Related Programs"],
    ["PCIP10", "Communications Technologies/Technicians and Support Services"],
    ["PCIP11", "Computer and Information Sciences and Support Services"],
    ["PCIP46", "Construction Trades"],
    ["PCIP13", "Education"],
    ["PCIP14", "Engineering"],
    ["PCIP15", "Engineering Technologies and Engineering-Related Fields"],
    ["PCIP23", "English Language and Literature/Letters"],
    ["PCIP16", "Foreign Languages, Literatures, and Linguistics"],
    ["PCIP19", "Family and Consumer Sciences/Human Sciences"],
    ["PCIP51", "Health Professions and Related Programs"],
    ["PCIP54", "History"],
    ["PCIP43", "Homeland Security, Law Enforcement, Firefighting and Related Protective Services"],
    ["PCIP22", "Legal Professions and Studies"],
    ["PCIP24", "Liberal Arts and Sciences, General Studies and Humanities"],
    ["PCIP25", "Library Science"],
    ["PCIP27", "Mathematics and Statistics"],
    ["PCIP47", "Mechanic and Repair Technologies/Technicians"],
    ["PCIP29", "Military Technologies and Applied Sciences"],
    ["PCIP30", "Multi/Interdisciplinary Studies"],
    ["PCIP03", "Natural Resources and Conservation"],
    ["PCIP31", "Parks, Recreation, Leisure, and Fitness Studies"],
    ["PCIP12", "Personal and Culinary Services"],
    ["PCIP38", "Philosophy and Religious Studies"],
    ["PCIP40", "Physical Sciences"],
    ["PCIP48", "Precision Production"],
    ["PCIP42", "Psychology"],
    ["PCIP44", "Public Administration and Social Service Professions"],
    ["PCIP41", "Science Technologies/Technicians"],
    ["PCIP45", "Social Sciences"],
    ["PCIP39", "Theology and Religious Vocations"],
    ["PCIP49", "Transportation and Materials Moving"],
    ["PCIP50", "Visual and Performing Arts"],
  ];

}
