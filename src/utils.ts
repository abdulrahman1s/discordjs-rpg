import { MersenneTwister19937, Random } from "random-js";

export const RED = "#FF0000";
export const GREEN = "#008000";
export const GOLD = "#ffd700";
export const BROWN = "#c66a10";
export const SILVER = "#c0c0c0";

export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

export const random = () => new Random(MersenneTwister19937.autoSeed());
