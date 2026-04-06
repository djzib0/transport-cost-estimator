import { Component } from '@angular/core';

@Component({
  selector: 'app-truck-layout',
  imports: [],
  templateUrl: './truck-layout.html',
  styleUrl: './truck-layout.css',
})
export class TruckLayout {

  rows = ['A', 'B'];
  columns = Array.from({length: 12}, (_, i) => i + 1)

}
