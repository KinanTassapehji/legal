import { Component, ViewEncapsulation } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-common-image-cropper',
  templateUrl: './common-image-cropper.component.html',
  styleUrl: './common-image-cropper.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CommonImageCropperComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }
}
