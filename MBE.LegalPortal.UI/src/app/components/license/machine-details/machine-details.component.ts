import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-machine-details',
  templateUrl: './machine-details.component.html',
  styleUrl: './machine-details.component.scss'
})
export class MachineDetailsComponent {

  machineInfo: any;
  macAddress = '';
  processorId = '';
  volumeSerial = '';
  domain = '';
  hash = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.machineInfo = JSON.parse(this.data);
    let machineData = {
      "processorId": this.machineInfo.processorId,
      "volumeSerial": this.machineInfo.volumeSerial,
      "macAddress": this.machineInfo.macAddress,
      "domain": this.machineInfo.domain,
      "hash":this.machineInfo.hash,
    };
    this.macAddress = machineData.macAddress;
    this.processorId = machineData.processorId;
    this.volumeSerial = machineData.volumeSerial;
    this.domain = machineData.domain;
    this.hash = machineData.hash;
    this.machineInfo = JSON.stringify(machineData);
  }

}
