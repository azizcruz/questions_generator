import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsTestComponent } from './questions-test.component';

describe('QuestionsTestComponent', () => {
  let component: QuestionsTestComponent;
  let fixture: ComponentFixture<QuestionsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
