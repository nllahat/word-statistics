import { Injectable, HttpService, BadRequestException } from '@nestjs/common';
import { WordsReader } from '../utils/wordsReader';
import { Readable } from 'stream';
import * as fs from 'fs';
import { TrieService } from './trie.service';

@Injectable()
export class WordsService {
  private wordsReader: WordsReader;

  constructor(
    private trieService: TrieService,
    private httpService: HttpService,
  ) {
    this.wordsReader = new WordsReader(
      this.trieService.insertWord.bind(this.trieService),
    );
  }

  processString(str: string): void {
    const readable = Readable.from([str]);

    this.wordsReader.read(readable);
  }

  async processUrl(url: string): Promise<void> {
    const response = await this.httpService
      .get(url, {
        responseType: 'stream',
      })
      .toPromise();

    if (response.data) {
      this.wordsReader.read(response.data);
    }
  }

  processFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException();
    }

    this.wordsReader.read(fs.createReadStream(filePath));
  }

  getWordCount(word: string): number {
    return this.trieService.getWordCount(word);
  }
}
