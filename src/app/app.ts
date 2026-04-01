import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewEstimate } from "./new-estimate/new-estimate";

@Component({
  selector: 'app-root',
  imports: [NewEstimate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('transport-cost-estimator');
}
