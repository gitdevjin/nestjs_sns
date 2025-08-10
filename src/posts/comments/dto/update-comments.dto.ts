import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentsDto } from './create-comments.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentsDto extends PartialType(CreateCommentsDto) {
  @IsOptional()
  @IsString()
  comment?: string;
}
