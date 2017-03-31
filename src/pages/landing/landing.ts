import { Component } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';

//import { SignUpPage } from '../sign-up/sign-up';
import { LoginPage } from '../login/login';

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
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    this.welcome_messages = [
      `The Digital College Counselor`,
      `Let's get started.`,
    ];

  }

  signUpForm() {
    //this.navCtrl.push(SignUpPage);
  }

  logInForm() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

}
