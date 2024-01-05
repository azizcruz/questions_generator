import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IBooleanQuestion, IMultipleChoiceQuestion, UserAnswer } from './questions-test.types';

@Component({
  selector: 'app-questions-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions-test.component.html',
  styleUrl: './questions-test.component.sass'
})
export class QuestionsTestComponent {
  @Input() questionsList: any;
  @Output() resetQuestions = new EventEmitter();

  currentQuestionIndex: number = 0;
  showResults: boolean = false;
  startTest: boolean = false;
  score: number = 0;
  userAnswer: string | undefined = undefined;
  userAnswers: UserAnswer[] = [];

  constructor(private sanitizer: DomSanitizer) {}


  get currentQuestion(): IMultipleChoiceQuestion | IBooleanQuestion | undefined {
    const question = (this.questionsList && this.questionsList[this.currentQuestionIndex]) ?? undefined;
    
    return question;
  }
  
  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questionsList.length - 1;
  }

  get totalPoints(): number {
    return this.questionsList.length;
  }
  get choices(): string[] | undefined {
    return this.currentQuestion?.incorrect_answers.concat(this.currentQuestion?.correct_answer);
  }

  nextQuestion(userAnswer: string | undefined) {
    if (this.currentQuestionIndex < this.questionsList.length - 1) {
      this.validateAndScore(userAnswer);
      this.currentQuestionIndex++;
      return;
    }

    if(this.isLastQuestion) {
      this.validateAndScore(userAnswer);
    }

    this.showResults = true;
  }

  validateAndScore(userAnswer: string | undefined) {
    this.validateAnswer(userAnswer);
    this.userAnswer = undefined;
  }

  validateAnswer(answer: string | undefined) {
    if (!answer || !this.currentQuestion) {
      return;
    }

    if (this.currentQuestion.correct_answer === answer) {
      this.score++;
      this.userAnswers.push({
        result: true,
        userAnswer: answer
      })
    } else {
      this.userAnswers.push({
        result: false,
        userAnswer: answer
      });
    }
  }

  restartTest() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.showResults = false;
    this.startTest = false;
    this.userAnswers = [];
    this.userAnswer = undefined;
  }

  back() {
    this.resetQuestions.emit();
  }

  sanitizeHtml(html: string | undefined) {
    if(!html) {
      return 'Invalid HTML';
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
