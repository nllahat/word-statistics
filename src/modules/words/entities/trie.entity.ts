import { Base } from './base.entity';

class TrieNode {
  private readonly ALPHABET_SIZE = 26;
  public children: TrieNode[];

  constructor(
    public value: string,
    public count: number = 0,
    public isEndOfWord?: boolean,
  ) {
    this.children = new Array(this.ALPHABET_SIZE);
  }
}

export class Trie implements Base {
  public root: TrieNode;

  constructor() {
    this.root = new TrieNode('#');
  }

  public insertWord(word: string) {
    let curr = this.root;

    if (!word) {
      return;
    }

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const alphaBethIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);

      if (!curr.children[alphaBethIndex]) {
        curr.children[alphaBethIndex] = new TrieNode(char);
      }

      curr = curr.children[alphaBethIndex];
    }

    curr.isEndOfWord = true;
    curr.count++;
  }

  public getWordFrequency(word: string): number {
    let curr = this.root;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const alphaBethIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);

      if (!curr.children[alphaBethIndex]) {
        return 0;
      }

      curr = curr.children[alphaBethIndex];
    }

    if (!curr.isEndOfWord) {
      return 0;
    }

    return curr.count;
  }
}
