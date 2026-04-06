import { GridResult } from "./interfaces";

export function calculateSpace(width: number, length: number): GridResult {
    return {
        gridWidth: Math.ceil(width / 1200),
        gridLength: Math.ceil(length / 1200),

    }
}