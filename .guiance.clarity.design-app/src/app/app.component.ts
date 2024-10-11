import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';
import { ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';

import { SiteNavComponent } from './components/site-nav/site-nav.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ClrMainContainerModule,
    ClrNavigationModule,
    SiteNavComponent,
    ThemeToggleComponent,
  ],
})
export class AppComponent {
  constructor() {
    // remove after https://github.com/vmware-clarity/ng-clarity/pull/1590 is released
    ClarityIcons.addIcons(windowCloseIcon);
    ClarityIcons.addAliases(['window-close', ['close']]);
  }
}
