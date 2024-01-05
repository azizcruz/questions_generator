import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsFormComponent } from './components/questions-form/questions-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuestionsFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {

}
