import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

  @Input() overlayShowing: boolean;
  @Input() overlayContent: any;
  @Input() overlayType: any;
  @Output() closeModal = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  hideOverlay() {
    this.closeModal.emit(false);
  }

}
