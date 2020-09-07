import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from './words.controller';
import { WordsService } from '../services/words.service';
import { createMock } from '@golevelup/ts-jest';
import { GetWordCountParams } from '../dto/getWordCountParams.dto';
import { random, internet, system } from 'faker';
import { WordsInputDto } from '../dto/wordsInput.dto';
import { NotFoundException } from '@nestjs/common';

describe('Words Controller', () => {
  let controller: WordsController;
  let wordsService: WordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WordsService,
          useValue: createMock<WordsService>(),
        },
      ],
      controllers: [WordsController],
    }).compile();

    controller = module.get<WordsController>(WordsController);
    wordsService = module.get<WordsService>(WordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWordFrequency', () => {
    const query: GetWordCountParams = createMock<GetWordCountParams>({
      word: random.word(),
    });
    const mockedFrequency = random.number();

    beforeEach(() => {
      jest
        .spyOn(wordsService, 'getWordFrequency')
        .mockReturnValueOnce(mockedFrequency);
    });

    it('should call getWordFrequency', () => {
      controller.getWordFrequency(query);

      expect(wordsService.getWordFrequency).toHaveBeenCalledWith(query);
      expect(wordsService.getWordFrequency).toHaveBeenCalledTimes(1);
    });

    it('should return the frequency resulted from the wordsService', () => {
      const result: number = controller.getWordFrequency(query);

      expect(result).toBe(mockedFrequency);
    });
  });

  describe('processText', () => {
    describe('text in body', () => {
      const data: WordsInputDto = {
        str: random.words(),
        wordDelimiter: ' ',
      };

      beforeEach(() => {
        jest.spyOn(wordsService, 'processString').mockReturnValueOnce();
      });

      it('should call processString', async () => {
        await controller.processText(data);

        expect(wordsService.processString).toHaveBeenCalledWith(
          data.str,
          data.wordDelimiter,
        );
        expect(wordsService.processString).toHaveBeenCalledTimes(1);
        expect(wordsService.processUrl).toHaveBeenCalledTimes(0);
        expect(wordsService.processFile).toHaveBeenCalledTimes(0);
      });

      it('should return undefined', async () => {
        const result = await controller.processText(data);

        expect(result).toBeUndefined();
      });
    });

    describe('text from url', () => {
      describe('success', () => {
        const data: WordsInputDto = {
          url: internet.url(),
          wordDelimiter: ' ',
        };

        beforeEach(() => {
          jest.spyOn(wordsService, 'processUrl').mockResolvedValueOnce();
        });

        it('should call processUrl', async () => {
          await controller.processText(data);

          expect(wordsService.processUrl).toHaveBeenCalledTimes(1);
          expect(wordsService.processUrl).toHaveBeenCalledWith(
            data.url,
            data.wordDelimiter,
          );
          expect(wordsService.processString).toHaveBeenCalledTimes(0);
          expect(wordsService.processFile).toHaveBeenCalledTimes(0);
        });

        it('should return undefined', async () => {
          const result = await controller.processText(data);

          expect(result).toBeUndefined();
        });
      });

      describe('error', () => {
        const data: WordsInputDto = {
          url: internet.url(),
          wordDelimiter: ' ',
        };

        beforeEach(() => {
          jest
            .spyOn(wordsService, 'processUrl')
            .mockRejectedValueOnce(new NotFoundException());
        });

        it('should throw', async () => {
          let resultError;

          try {
            await controller.processText(data);
          } catch (e) {
            resultError = e;
          }

          expect(resultError).toEqual(new NotFoundException());
        });
      });
    });

    describe('text in a local file', () => {
      const data: WordsInputDto = {
        localFilePath: system.filePath(),
        wordDelimiter: ' ',
      };

      beforeEach(() => {
        jest.spyOn(wordsService, 'processFile').mockReturnValueOnce();
      });

      it('should call processFile', async () => {
        await controller.processText(data);

        expect(wordsService.processFile).toHaveBeenCalledWith(
          data.localFilePath,
          data.wordDelimiter,
        );
        expect(wordsService.processFile).toHaveBeenCalledTimes(1);
        expect(wordsService.processUrl).toHaveBeenCalledTimes(0);
        expect(wordsService.processString).toHaveBeenCalledTimes(0);
      });

      it('should return undefined', async () => {
        const result = await controller.processText(data);

        expect(result).toBeUndefined();
      });
    });
  });
});
