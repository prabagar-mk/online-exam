import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClassSectionPageRoutingModule } from './class-section-routing.module';

import { ClassSectionPage } from './class-section.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClassSectionPageRoutingModule
  ],
  declarations: [ClassSectionPage]
})
export class ClassSectionPageModule {}
