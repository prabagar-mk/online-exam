import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddClassSectionPage } from './add-class-section.page';

describe('AddClassSectionPage', () => {
  let component: AddClassSectionPage;
  let fixture: ComponentFixture<AddClassSectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClassSectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddClassSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
