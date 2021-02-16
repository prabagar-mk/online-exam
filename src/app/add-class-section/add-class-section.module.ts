import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddClassSectionPageRoutingModule } from './add-class-section-routing.module';

import { AddClassSectionPage } from './add-class-section.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddClassSectionPageRoutingModule
  ],
  declarations: [AddClassSectionPage]
})
export class AddClassSectionPageModule {}
