import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  Req,
  Param,
} from '@nestjs/common';
import { WordsInputDto } from '../dto/wordsInput.dto';
import { WordsService } from '../services/words.service';
import { GetWordCountParams } from '../dto/getWordCountParams.dto';

@Controller('/v1/words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @HttpCode(202)
  async processText(@Body() data: WordsInputDto): Promise<void> {
    if (data.str) {
      this.wordsService.processString(data.str);
    } else if (data.url) {
      await this.wordsService.processUrl(data.url);
    } else if (data.localFilePath) {
      this.wordsService.processFile(data.localFilePath);
    } else {
      throw new BadRequestException();
    }
  }

  @Get(':word')
  getWordCount(@Param() params: GetWordCountParams): number {
    return this.wordsService.getWordCount(params.word);
  }
}
