import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadQuestionsPage } from './upload-questions.page';

const routes: Routes = [
  {
    path: '',
    component: UploadQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadQuestionsPageRoutingModule {}
