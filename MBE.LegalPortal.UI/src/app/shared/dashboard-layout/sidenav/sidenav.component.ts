import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent {
  sidenavData = [
    {name: 'On Boarding', link: 'onboarding', icon: 'editor_choice'},
    {name: 'Applications', link: 'applications', icon: 'apps'},
    {name: 'Accounts', link: 'accounts', icon: 'group'},
    {name: 'Subscription Plan', link: 'subscriptionPlans', icon: 'view_kanban'},
    {name: 'License', link: 'license', icon: 'description'},
    {name: 'Reseller', link: 'reseller', icon: 'work'},
    {name: 'Region/Country', link: 'region/country', icon: 'public'},
  ];
}
