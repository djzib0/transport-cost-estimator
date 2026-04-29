import { GridResult, Position, RowCell, RowKey, Truck } from "./interfaces";

export function calculateSpace(width: number, length: number): GridResult {
    return {
        gridWidth: Math.ceil(width / 1200),
        gridLength: Math.ceil(length / 1200),
    }
}

export function createEmptyTruck(licensePlate: string): Truck {
    const positions: Position[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    const rowKeys: RowKey[] = ['A', 'B'];
    const rows = {} as Truck['rows'];
    const id = generateId();

    rowKeys.forEach(rowKey => {
        rows[rowKey] = {} as Record<Position, RowCell>;

        positions.forEach(pos => {
            rows[rowKey][pos] = {
                ordersIds: []
            };
        });
    });

    return {
        id,
        licensePlate,
        rows
    }
}

export const generateId = (length = 16) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, b => chars[b % chars.length]).join('');
};

export function areAdjacentFieldsEmpty(
  truck: Truck, 
  rowKey: RowKey, 
  pos: Position, 
  gridWidth: number, 
  gridLength: number
): boolean {

  // helper → treat null as empty array
  const getIds = (cell: any): string[] =>
    Array.isArray(cell?.ordersIds) ? cell.ordersIds : [];

  let emptyFieldsRowA: string[] = [];
  let emptyFieldsRowB: string[] = [];

  // 1. Check if passed field is empty
  if (
    getIds(truck.rows[rowKey][pos]).length !== 0 || 
    (pos + gridLength - 1 > 12)
  ) {
    return false;
  } else {
    emptyFieldsRowA.push(`${rowKey}${pos}`);
  }

  // 2. If it's empty, check if adjacent fields are empty
  // by adding length to currently checked field coordinates, 
  // if the field is empty, push it to the array.
  // at the end if arrays length is equal to gridLength, it means
  // that there is enough space to fit the item.

  // if the item will cover two rows, we check both availability of fields
  // in two rows
  if (gridWidth === 2) {

    // if gridWidth is equal to 2, we have to check if field under the 
    // starting field is available, if yes, we can add it to the array
    if (getIds(truck.rows["B"][pos]).length === 0) {
      emptyFieldsRowB.push(`B${pos}`);
    }

    for (let i = 1; i < gridLength; i++) {
      const newPos = pos + i as Position;
      
      // check if adjacent field is available
      if (getIds(truck.rows["A"][newPos]).length === 0) {
        emptyFieldsRowA.push(`A${newPos}`);
      } 

      // check if equivalent field but in row B is available
      if (getIds(truck.rows["B"][newPos]).length === 0) {
        emptyFieldsRowB.push(`B${newPos}`);
      }
    }

  } else if (gridWidth === 1) {

    // console.log(`Investigating field ${rowKey}${pos}`)
    if (getIds(truck.rows[rowKey][pos]).length === 0) {
      emptyFieldsRowB.push(`${rowKey}${pos}`);
    }

    for (let i = 1; i < gridLength; i++) {
      const newPos = pos + i as Position;

      // check if adjacent field is available
      if (getIds(truck.rows[rowKey][newPos]).length === 0) {
        emptyFieldsRowA.push(`${rowKey}${newPos}`);
      }

      // if (truck.rows["B"][newPos].orderNumber !== null) {
      // } else {
      //     emptyFieldsRowB.push(`${"B"}${newPos}`)
      // }
    }

    if (
      gridLength === emptyFieldsRowA.length || 
      gridLength === emptyFieldsRowB.length
    ) {
      return true;
    }
  }

  if (
    gridLength === emptyFieldsRowA.length && 
    gridLength === emptyFieldsRowB.length
  ) {
    // console.log(`Original Field ${rowKey}${pos} CAN BE USED as a starting point`)
    return true;
  }

  return false;
}