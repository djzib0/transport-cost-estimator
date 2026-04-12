import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  isModalOpen = signal<boolean>(false);

  @Input() modalTitle = ""
  @Input() modalText = ""
  @Input() modalType = ""
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  get config() {
    switch (this.modalType) {
      case 'danger':
        return {
          header: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
          icon: '⚠️',
        };
      case 'success':
        return {
          header: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
          icon: '✅',
        };
      case 'warning':
        return {
          header: 'text-yellow-600',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          icon: '⚠️',
        };
      case 'info':
        return {
          header: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          icon: 'ℹ️',
        };
      default:
        return {
          header: 'text-gray-800',
          button: 'bg-gray-800 hover:bg-gray-900',
          icon: '',
        };
    }
  }

}
