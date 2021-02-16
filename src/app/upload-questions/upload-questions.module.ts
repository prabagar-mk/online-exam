import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadQuestionsPageRoutingModule } from './upload-questions-routing.module';

import { UploadQuestionsPage } from './upload-questions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadQuestionsPageRoutingModule
  ],
  declarations: [UploadQuestionsPage]
})
export class UploadQuestionsPageModule {}
