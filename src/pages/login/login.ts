import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

//import { ValidationService } from '../../validators/validators';

import { User } from '../../providers/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public userService: User,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])], //, ValidationService.emailValidator
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  loginUser() {
    // Check for form Validation
    if (!this.loginForm.valid) {
      this.presentAlert('Ouch', `Something's wrong. Check what you typed.`);
      return;
    }
    // Start loading screen
    let loading = this.loadingCtrl.create({
      //content: 'Creating your account. Please wait...'
    });
    loading.present();

    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    this.userService.login(email, password)
    .then( () => {
      setTimeout(()=> {
        this.dismiss();
        loading.dismiss();
      }, 1000);
    })
    .catch(error => {
      loading.dismiss();
      console.log(error);
      this.presentAlert("Ouch", `Something's wrong. I can't find your account. Try again.`);
    });
    //this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Got it']
    });
    alert.present();
  }

  checkValid() {
    console.log(this.loginForm.valid);
  }

}
