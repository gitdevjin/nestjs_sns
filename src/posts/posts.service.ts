import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';

/**
 * author: string;
 * title: string;
 * content;
 * likeCount: number;
 * commentcount: number;
 */

// 1) GET /posts
// 2) GET /posts/:id
// 3) POST /posts/
// 4) PUT /posts/:id
// 5) DELETE /posts/:id

// export interface PostModel {
//   id: number;
//   author: string;
//   title: string;
//   content: string;
//   likeCount: number;
//   commentCount: number;
// }

// let posts: PostModel[] = [
//   {
//     id: 1,
//     author: 'first author',
//     title: 'first title',
//     content: 'first content',
//     likeCount: 10,
//     commentCount: 10,
//   },
//   {
//     id: 2,
//     author: 'second author',
//     title: 'second title',
//     content: 'second content',
//     likeCount: 10,
//     commentCount: 30,
//   },
//   {
//     id: 3,
//     author: 'third author',
//     title: 'third title',
//     content: 'third content',
//     likeCount: 20,
//     commentCount: 30,
//   },
// ];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts(): Promise<PostsModel[]> {
    return this.postsRepository.find({
      relations: {
        author: true,
      },
    }); // await will be handled by nestjs or at above layer
  }

  async getPostbyId(id: number): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: { id },
    }); // since I need to use the post, I need await

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(
    authorId: number,
    title: string,
    content: string,
  ): Promise<PostsModel> {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(
    postId: number,
    title: string,
    content: string,
  ): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }
}
