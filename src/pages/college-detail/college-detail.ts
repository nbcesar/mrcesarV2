import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers/user';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-college-detail',
  templateUrl: 'college-detail.html'
})
export class CollegeDetailPage {

  @ViewChild('gradCanvas') gradCanvas;
  @ViewChild('retentionCanvas') retentionCanvas;
  @ViewChild('admitCanvas') admitCanvas;
  @ViewChild('studentsCanvas') studentsCanvas;

  gradChart: any;
  retentionChart: any;
  admitChart: any;
  studentsChart: any;

  public collegeData: Object;
  public popMajors: any;
  public satVR: Object;
  public satMT: Object;
  public inList: Boolean = false;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: User
  ) {}

  ionViewDidLoad() {
    // Get college data
    this.collegeData = this.navParams.get('collegeData');
    this.loadCollegeData();

  }

  loadCollegeData() {
    // Get user list to see if school is added or not
    this.userService.userList.subscribe(data => {
      if ( data.hasOwnProperty(this.collegeData['unitid']) ) {
        this.inList = true;
      }
      else {
        this.inList = false;
      }
    });

    // Create charts
    this.gradChart = new Chart(this.gradCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ["White", "Asian", "Black", "Latino"],
        datasets: [{
            label: 'Grad Rate',
            data: [
              Math.round(this.collegeData['c150_white'] * 100),
              Math.round(this.collegeData['c150_asian'] * 100),
              Math.round(this.collegeData['c150_black'] * 100),
              Math.round(this.collegeData['c150_hisp'] * 100)
            ],
            backgroundColor: [
                '#f1c40f',
                '#f1c40f',
                '#f1c40f',
                '#f1c40f',
            ],
            borderColor: [
                '#f1c40f',
                '#f1c40f',
                '#f1c40f',
                '#f1c40f',
            ],
            borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
              ticks: {
                beginAtZero:true,
                min: 0,
                max: 100,
                stepSize: 25
                // callback: function(value) {
                //   return value;
                // }
              },
              scaleLabel: {
                display: false,
                labelString: "Percentage"
              }
          }]
        },
        tooltips: {
          enabled: false
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          onComplete: function() {
            this.chart.controller.draw();
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize + 2, 'bold', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                var textY: Number;
                if (model.y > 90) {
                  textY = model.y - 3;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                }
                else {
                  textY = model.y + 22;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                }
                ctx.fillText(dataset.data[i] + "%", model.x, textY);
              }
            });
          },
        }

      }
    });
    this.retentionChart = new Chart(this.retentionCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [
          "Retention Rate"
        ],
        datasets: [
          {
            data: [
              Math.round(this.collegeData['retention_rate'] * 100),
              100 - Math.round(this.collegeData['retention_rate'] * 100),
            ],
            borderColor: [
              "black",
              "black"
            ],
            backgroundColor: [
              "black",
              "white"
            ],
            hoverBackgroundColor: [
              "black",
              "white"
            ],
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        animation: {
          onComplete: function() {
            this.chart.controller.draw();
            var width = this.chart.width;
            var height = this.chart.height;
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize + 3, 'bold', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

            ctx.fillText(this.data.datasets[0].data[0] + "%", width / 2, height / 2);
          }
        }
      }
    });
    this.admitChart = new Chart(this.admitCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [
          "Admit Rate"
        ],
        datasets: [
          {
            data: [
              Math.round(this.collegeData['admit_rate'] * 100),
              100 - Math.round(this.collegeData['admit_rate'] * 100),
            ],
            borderColor: [
              "black",
              "black"
            ],
            backgroundColor: [
              "black",
              "white"
            ],
            hoverBackgroundColor: [
              "black",
              "white"
            ],
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        animation: {
          onComplete: function() {
            this.chart.controller.draw();
            var width = this.chart.width;
            var height = this.chart.height;
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize + 3, 'bold', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

            ctx.fillText(this.data.datasets[0].data[0] + "%", width / 2,height / 2);
          }
        }
      }
    });
    this.studentsChart = new Chart(this.studentsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ["White", "Asian", "Black", "Latino"],
        datasets: [{
            label: 'Grad Rate',
            data: [
              Math.round(this.collegeData['ugds_white'] * 100),
              Math.round(this.collegeData['ugds_asian'] * 100),
              Math.round(this.collegeData['ugds_black'] * 100),
              Math.round(this.collegeData['ugds_hisp'] * 100)
            ],
            backgroundColor: [
                '#3498db',
                '#3498db',
                '#3498db',
                '#3498db',
            ],
            borderColor: [
                '#3498db',
                '#3498db',
                '#3498db',
                '#3498db',
            ],
            borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
              ticks: {
                beginAtZero:true,
                min: 0,
                max: 100,
                stepSize: 25
                // callback: function(value) {
                //   return value;
                // }
              },
              scaleLabel: {
                display: false,
                labelString: "Percentage"
              }
          }]
        },
        tooltips: {
          enabled: false
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          onComplete: function() {
            this.chart.controller.draw();
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize + 2, 'bold', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                var textY: Number;
                if (model.y > 90) {
                  textY = model.y - 3;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                }
                else {
                  textY = model.y + 22;
                  ctx.fillStyle = "black";
                  ctx.strokeStyle = "black";
                }
                ctx.fillText(dataset.data[i] + "%", model.x, textY);
              }
            });
          },
        }

      }
    });

    // SAT Scores
    this.satVR = {
      lower: this.collegeData['satvr25'],
      upper: this.collegeData['satvr75'],
    }
    this.satMT = {
      lower: this.collegeData['satmt25'],
      upper: this.collegeData['satmt75'],
    }

    // Popular majors
    var allMajors = [
      [this.collegeData['pcip01'],	"Agriculture, Agriculture Operations, and Related Sciences"],
      [this.collegeData['pcip03'],	"Natural Resources and Conservation"],
      [this.collegeData['pcip04'],	"Architecture and Related Services"],
      [this.collegeData['pcip05'],	"Area, Ethnic, Cultural, Gender, and Group Studies"],
      [this.collegeData['pcip09'],	"Communication, Journalism, and Related Programs"],
      [this.collegeData['pcip10'],	"Communications Technologies/Technicians and Support Services"],
      [this.collegeData['pcip11'],	"Computer and Information Sciences and Support Services"],
      [this.collegeData['pcip12'],	"Personal and Culinary Services"],
      [this.collegeData['pcip13'],	"Education"],
      [this.collegeData['pcip14'],	"Engineering"],
      [this.collegeData['pcip15'],	"Engineering Technologies and Engineering-Related Fields"],
      [this.collegeData['pcip16'],	"Foreign Languages, Literatures, and Linguistics"],
      [this.collegeData['pcip19'],	"Family and Consumer Sciences/Human Sciences"],
      [this.collegeData['pcip22'],	"Legal Professions and Studies"],
      [this.collegeData['pcip23'],	"English Language and Literature/Letters"],
      [this.collegeData['pcip24'],	"Liberal Arts and Sciences, General Studies and Humanities"],
      [this.collegeData['pcip25'],	"Library Science"],
      [this.collegeData['pcip26'],	"Biological and Biomedical Sciences"],
      [this.collegeData['pcip27'],	"Mathematics and Statistics"],
      [this.collegeData['pcip29'],	"Military Technologies and Applied Sciences"],
      [this.collegeData['pcip30'],	"Multi/Interdisciplinary Studies"],
      [this.collegeData['pcip31'],	"Parks, Recreation, Leisure, and Fitness Studies"],
      [this.collegeData['pcip38'],	"Philosophy and Religious Studies"],
      [this.collegeData['pcip39'],	"Theology and Religious Vocations"],
      [this.collegeData['pcip40'],	"Physical Sciences"],
      [this.collegeData['pcip41'],	"Science Technologies/Technicians"],
      [this.collegeData['pcip42'],	"Psychology"],
      [this.collegeData['pcip43'],	"Homeland Security & Law Enforcement"],
      [this.collegeData['pcip44'],	"Public Administration and Social Services"],
      [this.collegeData['pcip45'],	"Social Sciences"],
      [this.collegeData['pcip46'],	"Construction Trades"],
      [this.collegeData['pcip47'],	"Mechanic and Repair Technologies/Technicians"],
      [this.collegeData['pcip48'],	"Precision Production"],
      [this.collegeData['pcip49'],	"Transportation and Materials Moving"],
      [this.collegeData['pcip50'],	"Visual and Performing Arts"],
      [this.collegeData['pcip51'],	"Health Professions and Related Programs"],
      [this.collegeData['pcip52'],	"Business, Management, and Marketing"],
      [this.collegeData['pcip54'],	"History"]
    ];
    allMajors.sort(function compare(a,b) {
      if (a[0] < b[0])
        return 1;
      if (a[0] > b[0])
        return -1;
      return 0;
    });
    this.popMajors = allMajors.splice(0,5);
  }

  addSchool() {
    this.userService.addSchoolToList(this.collegeData);
  }
  removeSchool() {
    this.userService.removeSchoolFromList(this.collegeData);
  }

}
