import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from '../entity/comment.entity';
import { IsString } from 'class-validator';

export class CreateCommentsDto extends PickType(CommentsModel, ['comment'] as const) {
  @IsString()
  comment: string;
}
