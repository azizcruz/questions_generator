import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionsServiceService } from './questions-service.service';
import { IResponse } from './questions-form.types';
import { QuestionsTestComponent } from '../questions-test/questions-test.component';
import { IBooleanQuestion, IMultipleChoiceQuestion } from '../questions-test/questions-test.types';

@Component({
  selector: 'app-questions-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuestionsTestComponent],
  templateUrl: './questions-form.component.html',
  styleUrl: './questions-form.component.sass'
})
export class QuestionsFormComponent {

  isLoading: boolean = false;
  questionsList: IMultipleChoiceQuestion[] | IBooleanQuestion[] | null = null;

  fullName: FormControl = new FormControl('', [Validators.required]);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  numberOfQuestions: FormControl = new FormControl('', [Validators.required, Validators.min(1), Validators.max(49)]);
  difficulty: FormControl = new FormControl('', [Validators.required]);
  type: FormControl = new FormControl('', [Validators.required]);

  constructor(private questionsService: QuestionsServiceService) { }

  get isValidForm() {
    return this.fullName.valid && this.email.valid && this.numberOfQuestions.valid && this.difficulty.valid && this.type.valid;
  }

  resetForm() {
    this.fullName.reset();
    this.email.reset();
    this.numberOfQuestions.reset();
    this.difficulty.reset();
    this.type.reset();
  }

  storeSearchHistory() {
    const formData = {
      full_name: this.fullName.value,
      email: this.email.value,
      num_questions: this.numberOfQuestions.value,
      difficulty: this.difficulty.value,
      type: this.type.value
    }

    this.isLoading = true;
    this.questionsService.submitFormData(formData).subscribe({
      next: (response: IResponse) => {
        this.questionsList = response.results;
        this.resetForm();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  onSubmit() {
    if (!this.isValidForm) {
      return;
    }

    this.storeSearchHistory();

  }

  resetQuestions() {
    this.questionsList = null;
  }
}
