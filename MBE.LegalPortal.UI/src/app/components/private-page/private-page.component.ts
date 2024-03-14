import { Component, OnInit } from '@angular/core';
import { AzureAdService } from '../../services/azure-ad.service';
import { IProfile } from '../../interfaces/profile';
import { IRegion } from '../../interfaces/region';

@Component({
  selector: 'app-private-page',
  templateUrl: './private-page.component.html',
  styleUrl: './private-page.component.scss'
})
export class PrivatePageComponent implements OnInit {
  profile?: IProfile;
  regions: IRegion[] = [];

  constructor(private azureAdService: AzureAdService) { }

  ngOnInit(): void {
    this.getProfile();
    this.getRegions();

  }

  getProfile() {
    this.azureAdService.getUserProfile()
      .subscribe(profileInfo => {
        this.profile = profileInfo;
      })
  }

  getRegions() {
    this.azureAdService.getRegions().subscribe((regions) => {
      this.regions = regions;
    });
  }
}
