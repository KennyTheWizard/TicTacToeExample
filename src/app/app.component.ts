import { Component } from '@angular/core';
import { MainGameComponent } from './main-game/main-game.component';

@Component({
  selector: 'app-root',
  imports: [MainGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';
}
