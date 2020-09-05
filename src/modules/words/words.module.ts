import { Module, HttpModule } from '@nestjs/common';
import { WordsController } from './controllers/words.controller';
import { WordsService } from './services/words.service';
import { TrieService } from './services/trie.service';

@Module({
  imports: [HttpModule],
  controllers: [WordsController],
  providers: [WordsService, TrieService],
})
export class WordsModule {}
