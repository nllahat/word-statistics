import {
  Injectable,
  HttpService,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';
import { WORD_STATS_PROVIDER_TOKEN } from '../../../shared/utils/constants';
import { Base } from '../entities/base.entity';
import * as es from 'event-stream';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class WordsService {
  private readonly matchWordRegex: RegExp = new RegExp(
    '\\b([a-zA-Z]+)\\b',
    'gi',
  );

  constructor(
    @OgmaLogger(WordsService)
    private readonly logger: OgmaService,
    @Inject(WORD_STATS_PROVIDER_TOKEN)
    private readonly wordStatsProvider: Base,
    private readonly httpService: HttpService,
  ) {}

  private read(readableStream: Readable, wordDelimiter: string) {
    const now = new Date();
    let count = 0;

    this.logger.info('process started');

    readableStream
      .pipe(es.split())
      .pipe(
        es.mapSync((line: string) => {
          const words = line.split(wordDelimiter);

          for (const word of words) {
            if (!word) {
              continue;
            }

            const alphaBethOnly = word.match(this.matchWordRegex);

            if (!alphaBethOnly) {
              continue;
            }

            for (const alphaBeth of alphaBethOnly) {
              const parsedWord = alphaBeth && alphaBeth.trim().toLowerCase();

              if (parsedWord && parsedWord.length) {
                count++;
                this.wordStatsProvider.insertWord(parsedWord);
              }
            }
          }
        }),
      )
      .on('error', err => {
        this.logger.error(err);
      })
      .on('end', () => {
        this.logger.info('process finished');
        this.logger.info(`took ${Date.now() - now.getTime()} ms`);
        this.logger.info(`${count} words were saved`);
      });
  }

  processString(str: string, wordDelimiter: string): void {
    const readable = Readable.from([str]);

    this.read(readable, wordDelimiter);
  }

  async processUrl(url: string, wordDelimiter: string): Promise<void> {
    const response = await this.httpService
      .get(url, {
        responseType: 'stream',
      })
      .toPromise();

    if (response.data) {
      this.read(response.data, wordDelimiter);
    }
  }

  processFile(filePath: string, wordDelimiter: string): void {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File was not found');
    }

    this.read(fs.createReadStream(filePath), wordDelimiter);
  }

  getWordFrequency(word: string): number {
    return this.wordStatsProvider.getWordFrequency(word);
  }
}
