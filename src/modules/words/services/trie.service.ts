import { Injectable } from '@nestjs/common';
import { Trie } from '../utils/trieNode';

@Injectable()
export class TrieService {
  private trie: Trie;

  constructor() {
    this.trie = new Trie();
  }

  insertWord(word: string): void {
    this.trie.insert(word);
  }

  getWordCount(word: string): number {
    return this.trie.getWordCount(word);
  }
}
