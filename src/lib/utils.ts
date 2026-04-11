import { GridResult, Position, RowCell, RowKey, Truck } from "./interfaces";

export function calculateSpace(width: number, length: number): GridResult {
    return {
        gridWidth: Math.ceil(width / 1200),
        gridLength: Math.ceil(length / 1200),
    }
}

export function createEmptyTruck(licensePlate?: string): Truck {
    const positions: Position[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    const rowKeys: RowKey[] = ['A', 'B'];
    const rows = {} as Truck['rows'];

    rowKeys.forEach(rowKey => {
        rows[rowKey] = {} as Record<Position, RowCell>;

        positions.forEach(pos => {
            rows[rowKey][pos] = {
                orderNumber: null
            };
        });
    });

    return {
        licensePlate,
        rows
    }
}

export function areAdjacentFieldsEmpty(
    truck: Truck, 
    rowKey: RowKey, 
    pos: Position, 
    gridWidth: number, 
    gridLength: number
): boolean {


    let emptyFieldsRowA = [];
    let emptyFieldsRowB = [];

    // 1. Check if passed field is empty
    if (truck.rows[rowKey][pos].orderNumber !== null || (pos + gridLength -1 > 12)) {
        console.log(`Original Field ${rowKey}${pos} cannot be used`)
        return false
    } else {
        emptyFieldsRowA.push(`${rowKey}${pos}`)
    }

    // 2. If it's empty, check if adjacent fields are empty
    // by adding length to currently checked field

    // if the item will cover two rows, we check both availability of fields
    // in two rows
    if (gridWidth === 2) {
        // if gridWidth is uqual to 2, we have to check if field under the 
        // starting field is available, if yes, we can add it to the array
        if (truck.rows["B"][pos].orderNumber === null) {
            // console.log(`Original Field ${rowKey}${pos} cannot be used`)
            emptyFieldsRowB.push(`${"B"}${pos}`)
        }
        for (let i = 1; i < gridLength; i++) {
            // check if it will fit at the end of the truck
            const newPos = pos + i as Position
            
            // check if adjacent field is available
            if (truck.rows["A"][newPos].orderNumber !== null) {
                // console.log(`Field ${"A"}${newPos} cannot be used`)
            } else {
                // console.log(`Adding to the rowsA: ${rowKey}${newPos}`)
                emptyFieldsRowA.push(`${"A"}${newPos}`)
            } 
    
            // check if equivalent field but in row B is available
            if (truck.rows["B"][newPos].orderNumber !== null) {
                console.log(`Field ${"B"}${newPos} cannot be used`)
            } else {
                // console.log(`Adding to the rowsA: ${rowKey}${newPos}`)
                emptyFieldsRowB.push(`${"B"}${newPos}`)
            }
        }

        if (gridLength === emptyFieldsRowA.length && gridLength === emptyFieldsRowB.length) {
            console.log()
        }
    } else if (gridWidth === 1) {
        // if the iem is only 1 row wide, I'm saving the fields for fomparison
        // only to emptyFieldsRowA

    }
        // console.log("checking adjacent fields",`${rowKey}${newPos}`)
        // console.log(truck.rows[rowKey][newPos])

    if (gridLength === emptyFieldsRowA.length && gridLength === emptyFieldsRowB.length) {
        console.log(console.log(`Original Field ${rowKey}${pos} CAN BE USED as a starting point`))
        return true
    }
    return false
}