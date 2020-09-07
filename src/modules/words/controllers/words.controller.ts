import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  Param,
} from '@nestjs/common';
import { WordsInputDto } from '../dto/wordsInput.dto';
import { WordsService } from '../services/words.service';
import { GetWordCountParams } from '../dto/getWordCountParams.dto';

@Controller('/v1/words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get(':word')
  getWordFrequency(@Param() params: GetWordCountParams): number {
    return this.wordsService.getWordFrequency(params.word);
  }

  @Post()
  @HttpCode(202)
  async processText(@Body() data: WordsInputDto): Promise<void> {
    if (data.str) {
      this.wordsService.processString(data.str, data.wordDelimiter);
    } else if (data.url) {
      await this.wordsService.processUrl(data.url, data.wordDelimiter);
    } else if (data.localFilePath) {
      this.wordsService.processFile(data.localFilePath, data.wordDelimiter);
    } else {
      throw new BadRequestException();
    }
  }
}
