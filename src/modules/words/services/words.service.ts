import {
  Injectable,
  HttpService,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { WordsReader } from '../utils/wordsReader';
import { Readable } from 'stream';
import * as fs from 'fs';
import { WORDS_STATS_PROVIDER_TOKEN } from '../../../shared/utils/constants';
import { Base } from '../entities/base.entity';

@Injectable()
export class WordsService {
  private wordsReader: WordsReader;

  constructor(
    @Inject(WORDS_STATS_PROVIDER_TOKEN)
    private wordStatsProvider: Base,
    private httpService: HttpService,
  ) {
    this.wordsReader = new WordsReader(
      this.wordStatsProvider.insertWord.bind(this.wordStatsProvider),
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
    return this.wordStatsProvider.getWordFrequency(word);
  }
}
