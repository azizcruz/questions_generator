import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsFormComponent } from './questions-form.component';

describe('QuestionsFormComponent', () => {
  let component: QuestionsFormComponent;
  let fixture: ComponentFixture<QuestionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it should test if the validations are working if the user failed to fill the form correctly
  it('should test if the validations are working if the user failed to fill the form correctly', () => {
    const fullName = component.fullName;
    const email = component.email;
    const numberOfQuestions = component.numberOfQuestions;
    const difficulty = component.difficulty;
    const type = component.type;

    fullName.setValue('');
    email.setValue('');
    numberOfQuestions.setValue('');
    numberOfQuestions.setValue('');
    difficulty.setValue('');
    type.setValue('');

    expect(fullName.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(numberOfQuestions.valid).toBeFalsy();
    expect(difficulty.valid).toBeFalsy();
    expect(type.valid).toBeFalsy();
  });
  
});
