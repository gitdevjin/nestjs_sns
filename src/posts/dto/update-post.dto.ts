import { PartialType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

//when there is more proeprties and if they shouldn't be optional, then use OmitType
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({ message: stringValidationMessage })
  @IsOptional()
  title?: string; // `?` here is not mendatory

  @IsString({ message: stringValidationMessage })
  @IsOptional()
  content?: string;
}
