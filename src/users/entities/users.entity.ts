import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length, ValidationArguments } from 'class-validator';
import { ChatsModel } from 'src/chats/entity/chats.entity';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { LengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { CommentsModel } from 'src/posts/comments/entity/comment.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../decorator/user.decorator';
import { UserFollowersModel } from './user-followers.entity';

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

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel[];

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];

  //
  @OneToMany(() => UserFollowersModel, (ufm) => ufm.follower)
  followers: UserFollowersModel[];

  @OneToMany(() => UserFollowersModel, (ufm) => ufm.followee)
  followees: UserFollowersModel[];
}
