import { Readable } from 'stream';
import * as es from 'event-stream';

export class WordsReader {
  private readonly matchWordRegex: RegExp = new RegExp(
    '\\b([a-zA-Z]+)\\b',
    'gi',
  );
  constructor(private wordHandler: Function) {}

  read(readableStream: Readable, wordDelimiter: string) {
    let count = 0;
    let prefixCount = 0;
    const now = new Date();
    console.log('process started');

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
                this.wordHandler(parsedWord);
              }
            }
          }
        }),
      )
      .on('error', err => {
        console.error('Error while reading string.', err);
      })
      .on('end', () => {
        console.log('process finished');
        console.log(`took ${Date.now() - now.getTime()} ms`);
        console.log(`${count} words were saved`);
      });
  }
}
