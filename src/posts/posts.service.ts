import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>
  ) {}

  async getAllPosts(): Promise<PostsModel[]> {
    return this.postsRepository.find({
      relations: {
        author: true,
      },
    }); // await will be handled by nestjs or at above layer
  }

  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postsRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    return {
      data: posts,
    };
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `random post ${i}`,
        content: `random content ${i}`,
      });
    }
  }

  async getPostbyId(id: number): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    }); // since I need to use the post, I need await

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(
    authorId: number,
    postDto: CreatePostDto
  ): Promise<PostsModel> {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(
    postId: number,
    postDto: UpdatePostDto
  ): Promise<PostsModel> {
    const { title, content } = postDto;
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
