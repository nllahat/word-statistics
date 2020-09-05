import { Transform } from 'class-transformer';

export class GetWordCountParams {
  @Transform((word: string) => word.toLowerCase())
  word: string;
}
