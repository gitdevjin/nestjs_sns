import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException(`postId is required`);
    }

    const exists = await this.postService.checkPostExistsById(parseInt(postId));

    if (!exists) {
      throw new BadRequestException("post doesn't exists");
    }

    next();
  }
}
