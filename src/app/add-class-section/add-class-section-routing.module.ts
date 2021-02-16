import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClassSectionPage } from './add-class-section.page';

const routes: Routes = [
  {
    path: '',
    component: AddClassSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClassSectionPageRoutingModule {}
