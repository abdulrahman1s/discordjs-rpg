import { EmbedBuilder } from "discord.js";
import { Armor } from "./Armor";
import { Base } from "./Base";
import { Pet } from "./Pet";
import { Skill } from "./Skill";
import { 
  RED_CIRCLE, 
  formatPercent, 
  GOLD, 
  inlineCode, 
  random, 
  GREEN_CIRLE,
} from "./utils";
import { Weapon } from "./Weapon";
import { Elemental, ELEMENTAL_TYPES } from './Elemental'

/** 
 * Fighter is base class to be used in Battle. Only class derived from Fighter
 * can be used in Battle.
 *
 * ```typescript
 * class Monster extends Fighter {
 *    name = "boogy man";
 *    id = "boogy_man";
 *    attack = 20;
 * }
 * ```
 * */
export class Fighter extends Base {
  /** Fighter name */
  name: string;
  /** Fighter unique id */
  id: string;
  /** Damage dealt when attack */
  attack = 10;
  /** Fighter's health point */
  hp = 100;
  /** Amount of damage blocked when Fighter gets attacked*/
  armor = 0.1;
  /** Percentage to get critical attack */
  critChance = 0.3;
  /** Critical attack percentage increment */
  critDamage = 1.2;
  /** Array of equipped armors */
  equippedArmors: Armor[] = [];
  /** Array of equipped weapons */
  equippedWeapons: Weapon[] = [];
  /** Fighter's Skill */
  skill?: Skill;
  /** Fighter's Pet */
  pet?: Pet;
  /** Image to represent this Fighter */
  imageUrl?: string;

  element: Elemental

  constructor(name: string) {
    super();
    this.name = name;
    this.id = name;
    this.element = random.pick(Object.values(ELEMENTAL_TYPES))
  }

  /** Add new armor to the user */
  equipArmor(armor: Armor) {
    this.armor += armor.armor;
    this.equippedArmors.push(armor);
  }

  /** Add new weapon to the user */
  equipWeapon(weapon: Weapon) {
    this.attack += weapon.attack;
    this.equippedWeapons.push(weapon);
  }

  /** Returns true if critical attack */
  isCrit() {
    return random.bool(this.critChance);
  }

  get elementalDamage() {
    return this.equippedWeapons.reduce((prev, cur) => prev += cur.elementalDamage, 0)
  }

  get elementalChance() {
    return this.equippedWeapons.reduce((prev, cur) => prev += cur.elementalChance, 0)
  }

  isElementalDamage() {
    const chance: number = this.equippedWeapons.reduce((prev, cur) => prev += cur.elementalChance, 0)
    return random.bool(chance)
  }

  /** 
   * MessageEmbed that represents this Fighter. Passing another Fighter in this
   * method will make comparison between this Fighter stat with the other 
   * */
  show(fighter?: Fighter) {
    const armor = formatPercent(this.armor);
    const critChance = formatPercent(this.critChance);
    const elementalChance = formatPercent(this.elementalChance)

    const armorList = this.equippedArmors
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join("\n");

    const weaponList = this.equippedWeapons
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Profile")
      .setColor(GOLD)
      .setFields([
        { name: "Name", value: this.name },
        { name: 'Element', value: inlineCode(this.element.type) },
        { name: "Attack", value: inlineCode(Math.round(this.attack).toString()), inline: true },
        { name: "HP", value: inlineCode(Math.round(this.hp).toString()), inline: true },
        { name: "Armor", value: inlineCode(armor), inline: true },
        { name: "Crit Chance", value: inlineCode(critChance), inline: true },
        { name: "Crit Damage", value: inlineCode(`x${this.critDamage.toFixed(1)}`), inline: true },
        { name: 'Elemental Chance', value: inlineCode(elementalChance), inline: true },
        { name: 'Elemental Damage', value: inlineCode(`x${this.elementalDamage.toFixed(1)}`), inline: true },
        { name: "Skill", value: this.skill?.name || "none", inline: true },
        { name: "Pet", value: this.pet?.name || "none" },
        { name: "Armors", value: armorList || "none", inline: true },
        { name: "Weapons", value: weaponList || "none", inline: true },
      ])

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    if (fighter) {

      const fields1  = ["attack", "hp"] as const;
      let i = 1;

      for (const field of fields1) {

        const monsterStat = this[field];
        const playerStat = fighter[field];
        let stat = monsterStat.toString();

        if (playerStat > monsterStat) {
          stat += ` ${GREEN_CIRLE}`;
        } else if (monsterStat > playerStat) {
          stat += ` ${RED_CIRCLE}`;
        }

        embed.data.fields![i].value = inlineCode(stat);

        i++;
      }

      const fields2 = ["armor", "critChance", 'elementalChance'] as const;
      for (const field of fields2) {

        const monsterStat = this[field];
        const playerStat = fighter[field];
        let stat = formatPercent(monsterStat);

        if (playerStat > monsterStat) {
          stat += ` ${GREEN_CIRLE}`;
        } else if (monsterStat > playerStat) {
          stat += ` ${RED_CIRCLE}`;
        }

        embed.data.fields![i].value = inlineCode(stat);

        i++;
      }


      const fields3 = ["critDamage", 'elementalDamage'] as const;
      for (const field of fields3) {

        const monsterStat = this[field];
        const playerStat = fighter[field];
        let stat = `x${monsterStat.toFixed(1)}`;

        if (playerStat > monsterStat) {
          stat += ` ${GREEN_CIRLE}`;
        } else if (monsterStat > playerStat) {
          stat += ` ${RED_CIRCLE}`;
        }

        embed.data.fields![i].value = inlineCode(stat);

        i++;
      }
    }

    return embed;
  }
}
