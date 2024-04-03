import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() image!: string;
  @Input() selected!: boolean;
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Output() setAsDefault: EventEmitter<number> = new EventEmitter<number>();
  @Output() cardClick: EventEmitter<number> = new EventEmitter<number>();

  onDelete(): void {
    this.delete.emit(this.id);
  }

  onSetAsDefault(): void {
    this.selected = true;
    this.setAsDefault.emit(this.id);
  }

  onCardClick(): void {
    this.cardClick.emit(this.id);
  }
}
