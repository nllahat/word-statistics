import {
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class WordsInputDto {
  @ValidateIf(
    o => (o.localFilePath === undefined && o.url === undefined) || o.str,
  )
  @IsNotEmpty()
  @IsString()
  str?: string;

  @ValidateIf(
    o => (o.str === undefined && o.url === undefined) || o.localFilePath,
  )
  @IsOptional()
  @IsString()
  localFilePath?: string;

  @ValidateIf(
    o => (o.str === undefined && o.localFilePath === undefined) || o.url,
  )
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  wordDelimiter?: string = ' ';
}
