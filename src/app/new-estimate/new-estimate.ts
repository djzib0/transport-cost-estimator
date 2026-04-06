import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";

@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  itemList = signal<Item[]>([])

  truckList = signal<Truck[]>([
    // {
    //   licensePlate: "123 ABC",
    //   rowA1: {
    //     orderNumber: null
    //   }
    // }
  ])

  addItem(item: Item) {
    console.log("adding item")
    const currentItemList = this.itemList();
    const updatedItemList = [...currentItemList, item]; // adds new item
    this.itemList.set(updatedItemList);
  }

}
