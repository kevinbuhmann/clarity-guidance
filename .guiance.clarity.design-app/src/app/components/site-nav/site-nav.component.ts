import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClrNavigationModule, ClrVerticalNavModule } from '@clr/angular';

import cipPages from '../../../compiled-content/cip-pages.json';

@Component({
  selector: 'app-site-nav',
  templateUrl: './site-nav.component.html',
  styleUrl: './site-nav.component.scss',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ClrNavigationModule, ClrVerticalNavModule],
})
export class SiteNavComponent {
  protected readonly cipPages = cipPages;
}
