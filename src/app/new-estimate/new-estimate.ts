import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, ModalType, Position, RowKey, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";
import { areAdjacentFieldsEmpty, createEmptyTruck } from '../../lib/utils';
import { Modal } from "../../components/modal/modal";
import { ɵInternalFormsSharedModule } from "@angular/forms";

@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout, Modal, ɵInternalFormsSharedModule],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  exampleTruck: Truck = {
    licensePlate: "GWE 3456",
    rows: {
      A: {
        // 1: { orderNumber: ["32334", "32332"] },
        1: { orderNumber: [] },
        2: { orderNumber: []},
        3: { orderNumber: ["32335"] },
        4: { orderNumber: []},
        5: { orderNumber: []},
        6: { orderNumber: []},
        7: { orderNumber: []},
        8: { orderNumber: []},
        9: { orderNumber: []},
        10: { orderNumber: []},
        11: { orderNumber: []},
        12: { orderNumber: []}
      },
      B: {
        1: { orderNumber: []},
        2: { orderNumber: []},
        3: { orderNumber: []},
        4: { orderNumber: []},
        5: { orderNumber: ["32338"] },
        6: { orderNumber: []},
        7: { orderNumber: []},
        8: { orderNumber: []},
        9: { orderNumber: []},
        10: { orderNumber: ["32338"] },
        11: { orderNumber: []},
        12: { orderNumber: []}
      }
    }
  }

  exampleItem: Item = {
    id: "kjlajljadlja",
    name: "rudder",
    width: 1300,
    length: 3400,
    isStacked: false,
    orderNumber: "45665",
    clientOrderNumber: null,
    gridWidth: 2, // keeps the number of pallete fields in truck grid row A
    gridLength: 3, // keeps the number of pallete fields in truck grid row B
    truckNumber: "",
    startingField: null,
  }

  itemList = signal<Item[]>([
    this.exampleItem,
    {
    id: "1234abcde!@",
    name: "nozzle",
    width: 400,
    length: 1100,
    isStacked: false,
    orderNumber: "45665",
    clientOrderNumber: null,
    gridWidth: 1, // keeps the number of pallete fields in truck grid row A
    gridLength: 1, // keeps the number of pallete fields in truck grid row B
    truckNumber: "",
    startingField: null,
    }
  ])
  
  truckList = signal<Truck[]>([
    this.exampleTruck,
    // createEmptyTruck("GDA 1234")
  ])

  // VARIABLES

  selectedTruck = signal<Truck | null>(null)

  // END OF VARIABLES

  //MODAL controls
  isModalOpen = signal<boolean>(false);
  modalTitle = signal<string>("");
  modalText = signal<string>("");
  modalType = signal<ModalType>("default");

  openModal(modalTitle: string, modalText: string, modalType: ModalType) {
    this.modalTitle.set(modalTitle);
    this.modalText.set(modalText);
    this.modalType.set(modalType);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.modalTitle.set("");
    this.modalText.set("");
    this.modalType.set("default");
    this.isModalOpen.set(false);
  }
  

  addItem(item: Item) {
    const currentItemList = this.itemList();
    const updatedItemList = [...currentItemList, item]; // adds new item
    this.itemList.set(updatedItemList);
  }

  addTruck() {
    this.truckList().push(
      createEmptyTruck("KW 29993")
    );
  }

  onTruckChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;

    this.itemList.update(list => 
      list.map((item, i) =>
      i === index ? {...item, truckNumber: value } : item
      )
    )
  }

  onSpaceChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;
    console.log(value)
    this.itemList.update(list => 
      list.map((item, i) =>
      i === index ? {...item, startingField: value } : item
      )
    )
    console.log(this.itemList())
  }

  selectTruck(truck: Truck) {
    this.selectedTruck.set(truck)
  }

  saveItemOnTruck(item: Item) {
  console.log(`saving item ${item.name} from order ${item.orderNumber}`);

  let fieldsToSave: string[] = [];

  if (item.startingField) {
    for (let i = 0; i < item.gridLength; i++) {
      const pos = Number(item.startingField[1]) + i;

      if (item.gridWidth === 1) {
        fieldsToSave.push(`${item.startingField[0]}${pos}`);
      } else {
        fieldsToSave.push(`${item.startingField[0]}${pos}`);
        fieldsToSave.push(`B${pos}`);
      }
    }
  }

  // reset remaining items in itemList
  // this.itemList().forEach(element => {
  //   if (element.id === item.id ) {
  //     console.log("This is the same item")
  //   } else {
  //     console.log("this is not the same item")
  //     element.startingField = null;
  //   }

  //   console.log(this.itemList()[1].startingField, " starting field")

  //   console.log(element.startingField, "element starting field")
  // })

  this.itemList.update(items =>
    items.map(item => {
      if (!item.startingField) return item;

      const available = this.showFreeTruckSpace(
        item.truckNumber,
        item.gridWidth,
        item.gridLength
      );

      if (!available.includes(item.startingField)) {
        return { ...item, startingField: null };
      }

      return item;
    })
  );

  console.log(this.itemList(), "item list after saving")

  const updatedTruckList = this.truckList().map(truck => {
    if (truck.licensePlate !== item.truckNumber) return truck;

    // clone rows deeply (only what we need)
    const updatedRows = { ...truck.rows };

    fieldsToSave.forEach(field => {
      const rowKey = field[0] as keyof typeof truck.rows;
      const position = Number(field.slice(1)) as keyof typeof truck.rows.A;

      updatedRows[rowKey] = {
        ...updatedRows[rowKey],
        [position]: {
          ...updatedRows[rowKey][position],
          orderNumber: item.orderNumber
            ? [
                ...(updatedRows[rowKey][position].orderNumber ?? []),
                item.orderNumber
              ]
            : updatedRows[rowKey][position].orderNumber ?? []
        }
      };
    });

    return {
      ...truck,
      rows: updatedRows
    };
  });

  this.truckList.set(updatedTruckList);

  console.log(this.truckList(), "updated trucks");
}
  showFreeTruckSpace(
    licensePlate: string | null | undefined,
    gridWidth: number | null | undefined,
    gridLength: number | null | undefined,
  ) {
    const truck = this.truckList().find(truck => {
      return truck.licensePlate === licensePlate
    })

    console.log(licensePlate, " truck")
    let freeSpaces: string[] = []

    const positions: Position[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    // const rowKeys: RowKey[] = gridWidth === 2 ? ['A'] : ['A', 'B']
    const rowKeys: RowKey[] = ['A', 'B']
    
    if (gridWidth === 2) {
      for (let rowKey of rowKeys) {
        for (let pos of positions) {
          // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
          // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
          if (
            (gridWidth && gridLength) 
            && truck?.rows[rowKey][pos].orderNumber.length === 0
            && areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
          ) {
            freeSpaces.push(`${rowKey}${pos}`)
          }
        };
      };

      // when gridWidth is 2, we take only row A coordinates
      const filteredFreeSpaces: string[] = freeSpaces.filter(item => !item.includes("B"))
      
      return filteredFreeSpaces || [];

    } else if (gridWidth === 1) {
        for (let rowKey of rowKeys) {
          for (let pos of positions) {
            // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
            // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
    
            if (
              (gridWidth && gridLength) 
              && truck?.rows[rowKey][pos].orderNumber.length === 0
              && areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
            ) {
              freeSpaces.push(`${rowKey}${pos}`)
            }
          };
        };
    };    

    return freeSpaces;
  }
}
