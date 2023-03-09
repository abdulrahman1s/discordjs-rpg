export enum ElementalType {
    Fire,
    Mist,
    Physical,
    Sludge,
    Frost,
}

export class Elemental {
    constructor(readonly type: ElementalType, readonly strongAgainst: ElementalType[], readonly weakAgainst: ElementalType[]) { }

    isStrongAgainst(elm: Elemental): boolean {
      return this.strongAgainst.includes(elm.type)
    }
  
    isWeakAgainst(elm: Elemental): boolean {
      return this.weakAgainst.includes(elm.type)
    }
  }

  
  export const FIRE = new Elemental(ElementalType.Fire, [ElementalType.Mist], [ElementalType.Frost]);
  export const MIST = new Elemental(ElementalType.Mist, [ElementalType.Fire], [ElementalType.Sludge]);
  export const PHYSICAL = new Elemental(ElementalType.Physical, [], []);
  export const SLUDGE = new Elemental(ElementalType.Sludge, [ElementalType.Frost], [ElementalType.Mist]);
  export const FROST = new Elemental(ElementalType.Frost, [ElementalType.Sludge], [ElementalType.Fire]);
  
  export const ELEMENTAL_TYPES = {
    FIRE,
    MIST,
    PHYSICAL,
    SLUDGE,
    FROST,
  };