import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { LengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { PostsModel } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UsersModel extends BaseModel {
  @Column({ length: 20, unique: true })
  @IsString({ message: stringValidationMessage })
  @Length(2, 20, { message: LengthValidationMessage })
  nickname: string;

  @Column({ unique: true })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  /**
   * Request
   * frontend -> backend : plain object(JSON) -> class instance(dto)
   *
   * Response
   * backend -> frontend: class instance(Dto) -> plain object(JSON)
   */
  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 8, {
    message: LengthValidationMessage,
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
