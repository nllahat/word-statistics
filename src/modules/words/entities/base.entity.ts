export abstract class Base {
  /**
   * insertWord
   */
  public abstract insertWord(word: string): void;

  /**
   * getWordFrequency
   */
  public abstract getWordFrequency(word: string): number;
}
