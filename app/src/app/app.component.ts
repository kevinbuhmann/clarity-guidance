import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SiteNavComponent } from './components/site-nav/site-nav.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterLink, RouterOutlet, SiteNavComponent, ThemeToggleComponent],
})
export class AppComponent {}
