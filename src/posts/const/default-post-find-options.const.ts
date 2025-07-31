import { FindManyOptions } from 'typeorm';
import { PostsModel } from '../entities/posts.entity';

//This is now unnecessary, outdated, without worrying typo, you can use relations options,
//Typeorm provide the feature
/**
 * for example you don't neeed to do like relations ['author', 'user']
 * you can just do relations : {authre: true, user: true}
 */
export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {};
