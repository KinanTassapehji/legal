import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  progressBar: boolean = false;
  private emitChangeSource = new Subject<boolean>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  constructor() { }

  showAndHideProgressBar(progressBar: boolean) {
    this.emitChangeSource.next(progressBar);
  }
}
