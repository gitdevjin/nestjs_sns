import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesEnum, UsersModel } from 'src/users/entities/users.entity';
import { PostsService } from '../posts.service';

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
  constructor(private readonly postService: PostsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('User Info not Found');
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('PostId is required for params');
    }

    const isGood = this.postService.isPostMine(user.id, parseInt(postId));

    if (!isGood) {
      throw new ForbiddenException('Not authorized user');
    }

    return true;
  }
}
