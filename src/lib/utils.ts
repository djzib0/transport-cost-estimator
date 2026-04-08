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