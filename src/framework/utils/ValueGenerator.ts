import { v4 as uuid } from 'uuid';
import { ILoremIpsumParams, loremIpsum } from 'lorem-ipsum';
import adjectives from './Adjectives';
import nouns from './Nouns';

enum Prefix {
  EXAMPLE = 'e',
}

export default class ValueGenerator {
    private static instance: ValueGenerator = null;

    private static exampleCounter = 1;
    private static readonly counters = new Map<string, number>();
    private static readonly SEPARATOR = '.';

    static getInstance(): ValueGenerator {
      if (ValueGenerator.instance === null) {
        ValueGenerator.instance = new ValueGenerator();
      }

      return ValueGenerator.instance;
    }

    getRandomName(): string {
      return adjectives[this.getRandomNumber(0, adjectives.length)]
      + '_'
      + nouns[this.getRandomNumber(0, nouns.length)];
    }

    static getRandomString(params: ILoremIpsumParams): string {
      return loremIpsum(params);
    }

    static generateUUID(): string {
      return uuid();
    }

    getRandomNumber(min = 0, max = 100000): number {
      return Math.floor(Math.random() * (max - min) + min);
    }

    getRandomNameForExampleId(): string {
      return this.nextNameWithNumber(Prefix.EXAMPLE, ValueGenerator.exampleCounter);
    }

    nextExampleName(name: string): string {
      return ValueGenerator.formatText(
        Prefix.EXAMPLE,
        this.getRandomName(),
        ValueGenerator.SEPARATOR,
        ValueGenerator.getNextNumber(name)
      );
    }

    private static formatText(prefix: string, main: string, separator: string, counter: number) {
      return `${prefix}${main}${separator}-${counter}`;
    }

    private nextNameWithNumber(itemName: string, counter: number) {
      return `${this.getRandomName()}.${itemName}-${counter}`;
    }

    private static getNextNumber(item: string): number {
      if (ValueGenerator.counters.has(item)) {
        ValueGenerator.counters.set(item, ValueGenerator.counters.get(item) + 1);
      } else {
        ValueGenerator.counters.set(item, 1);
      }

      return ValueGenerator.counters.get(item);
    }
}




