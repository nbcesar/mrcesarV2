import { Component } from '@angular/core';
import { NavController, ModalController, Platform, AlertController, ActionSheetController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { CreateStudentAcct } from '../create-student-acct/create-student-acct';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

  public welcome_text: string = `Hi. I'm Mr. Cesar.`;
  public welcome_messages = [];
  public message_count = 0;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public plt: Platform
  ) {}

  ionViewDidLoad() {
    this.welcome_messages = [
      `The Digital College Counselor`,
      `Let's get started.`,
    ];

  }

  signUpForm() {
    //this.navCtrl.push(SignUpPage);

    // Ask user if Student or Counselor
    // Use alert if on desktop, actionsheet on mobile
    if (this.plt.is('core')) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Student or Counselor');
      alert.addInput({
        type: 'radio',
        label: 'Student',
        value: 'student',
        checked: true
      });
      alert.addInput({
        type: 'radio',
        label: 'Counselor',
        value: 'counselor',
        checked: false
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          console.log(data);
          if (data == 'student') {
            this.navCtrl.push(CreateStudentAcct);
          }
        }
      });
      alert.present();
    }
    else {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Student or Counselor',
        buttons: [
          {
            text: 'Student',
            handler: () => {
            this.navCtrl.push(CreateStudentAcct);
            }
          },{
            text: 'Counselor',
            handler: () => {
              console.log('Counselor clicked');
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  logInForm() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

}
