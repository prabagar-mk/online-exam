import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstitutionDetailsPage } from './institution-details.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstitutionDetailsPageRoutingModule {}
