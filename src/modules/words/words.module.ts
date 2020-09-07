import { Module, HttpModule } from '@nestjs/common';
import { WordsController } from './controllers/words.controller';
import { WordsService } from './services/words.service';
import { wordStatsProvider } from './providers/wordStats.provider';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [HttpModule, OgmaModule.forFeature(WordsService)],
  controllers: [WordsController],
  providers: [wordStatsProvider, WordsService],
})
export class WordsModule {}
