import { Readable } from 'stream';
import * as es from 'event-stream';

export class WordsReader {
  private readonly matchWordRegex: RegExp = new RegExp(
    '\\b([a-zA-Z]+)\\b',
    'gi',
  );
  constructor(private wordHandler: Function) {}

  read(readableStream: Readable) {
    readableStream
      .pipe(es.split(this.matchWordRegex))
      .pipe(
        es.mapSync((word: string) => {
          if (word && word.trim().length) {
            this.wordHandler(word.toLowerCase());
          }
        }),
      )
      .on('error', err => {
        console.error('Error while reading string.', err);
      })
      .on('end', () => {
        console.log('Done');
      });
  }
}
