export interface Item {
    name: string;
    width: number;
    length: number;
    isStacked?: boolean | null;
    orderNumber?: string | null;
    clientOrderNumber?: string | null;
    gridWidth?: number | null; // keeps the number of pallete fields in truck grid row A
    gridLength?: number | null; // keeps the number of pallete fields in truck grid row B
    truckNumber?: string | null;
    startingField?: (string | number)[] | null;
}

export interface GridResult {
    gridWidth: number;
    gridLength: number;
}


// Truck
// export interface Truck {
//     licensePlate?: string;
//     rowA1: {
//         orderNumber: string[] | null; // can contain stacked order
//     },
//     rowA2: {
//         orderNumber: string[] | null; // can contain stacked order
//     },
// }

export type Position = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; 
export type RowKey = 'A' | 'B';

export type RowCell = {
    orderNumber: string[] | null;
}

export interface Truck {
    licensePlate?: string;
    rows: Record<RowKey, Record<Position, RowCell>>;
}

export type ModalType = 'default' | 'info' | 'success' | 'warning' | 'danger';