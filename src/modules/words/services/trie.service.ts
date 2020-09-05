import { Injectable } from '@nestjs/common';
import { Trie } from '../entities/trie.entity';

@Injectable()
export class TrieService {
  private trie: Trie;

  constructor() {
    this.trie = new Trie();
  }

  insertWord(word: string): void {
    this.trie.insertWord(word);
  }

  getWordCount(word: string): number {
    return this.trie.getWordFrequency(word);
  }
}
