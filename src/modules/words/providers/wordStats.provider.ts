import { WORDS_STATS_PROVIDER_TOKEN } from '../../../shared/utils/constants';
import { Trie } from '../entities/trie.entity';

export const wordStatsProvider = {
  provide: WORDS_STATS_PROVIDER_TOKEN,
  useClass: Trie,
};
