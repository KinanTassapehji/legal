import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IProfile } from '../../../interfaces/profile';
import { AzureAdService } from '../../../services/azure-ad.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  profile?: IProfile;
  constructor(private azureAdService: AzureAdService) { }
  isLoading = true;

  ngOnInit(): void {
    this.getProfile();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  getProfile() {
    this.azureAdService.getUserProfile()
      .subscribe(profileInfo => {
        this.profile = profileInfo;
      })
  }

  logout() {
    this.azureAdService.logout();
  }
}
