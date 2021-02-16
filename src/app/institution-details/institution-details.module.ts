import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InstitutionDetailsPageRoutingModule } from './institution-details-routing.module';

import { InstitutionDetailsPage } from './institution-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InstitutionDetailsPageRoutingModule
  ],
  declarations: [InstitutionDetailsPage]
})
export class InstitutionDetailsPageModule {}
