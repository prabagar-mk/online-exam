import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTestPageRoutingModule } from './create-test-routing.module';

import { CreateTestPage } from './create-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateTestPageRoutingModule
  ],
  declarations: [CreateTestPage]
})
export class CreateTestPageModule {}
