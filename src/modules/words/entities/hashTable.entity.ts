import { Base } from './base.entity';

export class HashTable implements Base {
  private hashTable: Map<string, number>;

  constructor() {
    this.hashTable = new Map<string, number>();
  }
  public insertWord(word: string): void {
    if (this.hashTable.has(word)) {
      this.hashTable.set(word, this.hashTable.get(word) + 1);
    } else {
      this.hashTable.set(word, 1);
    }
  }
  public getWordFrequency(word: string): number {
    return this.hashTable.get(word);
  }
}
