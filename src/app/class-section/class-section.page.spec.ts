import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassSectionPage } from './class-section.page';

describe('ClassSectionPage', () => {
  let component: ClassSectionPage;
  let fixture: ComponentFixture<ClassSectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
