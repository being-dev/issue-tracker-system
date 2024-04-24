import { Component, Directive, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @ViewChild('comodoModalDialog', { static: false }) comodoModalDialog!: ElementRef;

  ngOnInit(): void {

  }

  openModal() {
    this.comodoModalDialog.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.comodoModalDialog.nativeElement.style.display = 'none';
  }



}
