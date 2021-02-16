import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassSectionPage } from './class-section.page';

const routes: Routes = [
  {
    path: '',
    component: ClassSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassSectionPageRoutingModule {}
