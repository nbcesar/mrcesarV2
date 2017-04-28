import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateStudentAcct } from './create-student-acct';

@NgModule({
  declarations: [
    CreateStudentAcct,
  ],
  imports: [
    IonicPageModule.forChild(CreateStudentAcct),
  ],
  exports: [
    CreateStudentAcct
  ]
})
export class CreateStudentAcctModule {}
