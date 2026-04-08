import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";
import { createEmptyTruck } from '../../lib/utils';

@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  itemList = signal<Item[]>([])
  truckList = signal<Truck[]>([
    createEmptyTruck("GDA 1234")
  ])

  selectedTruck = signal<Truck | null>(null)
  

  addItem(item: Item) {
    console.log("adding item")
    const currentItemList = this.itemList();
    const updatedItemList = [...currentItemList, item]; // adds new item
    this.itemList.set(updatedItemList);
  }

  addTruck() {
    this.truckList().push(
      createEmptyTruck()
    );
  }

  onTruckChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;

    this.itemList.update(list => 
      list.map((item, i) =>
      i === index ? {...item, truckNumber: value } : item
      )
    )
    console.log(this.itemList())
  }

  selectTruck(truck: Truck) {
    this.selectedTruck.set(truck)
  }


}
