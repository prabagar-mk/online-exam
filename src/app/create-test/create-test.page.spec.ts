import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTestPage } from './create-test.page';

describe('CreateTestPage', () => {
  let component: CreateTestPage;
  let fixture: ComponentFixture<CreateTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
