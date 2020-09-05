import { Module, HttpModule } from '@nestjs/common';
import { WordsController } from './controllers/words.controller';
import { WordsService } from './services/words.service';
import { wordStatsProvider } from './providers/wordStats.provider';

@Module({
  imports: [HttpModule],
  controllers: [WordsController],
  providers: [wordStatsProvider, WordsService],
})
export class WordsModule {}
