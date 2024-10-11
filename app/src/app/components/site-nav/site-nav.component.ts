import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClrVerticalNavModule } from '@clr/angular';

import pages from '../../../compiled-content/pages.json';

@Component({
  selector: 'app-site-nav',
  templateUrl: './site-nav.component.html',
  styleUrl: './site-nav.component.scss',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ClrVerticalNavModule],
})
export class SiteNavComponent {
  protected readonly pages = pages;
}
