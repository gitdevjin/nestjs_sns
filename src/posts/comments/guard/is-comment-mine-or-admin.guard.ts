import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesEnum, UsersModel } from 'src/users/entities/users.entity';
import { CommentsService } from '../comments.service';
import { Request } from 'express';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & { user: UsersModel };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('User Info Not Found');
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const commentId = req.params.commentId;

    const isGood = await this.commentService.isCommentMine(user.id, parseInt(commentId));

    if (!isGood) {
      throw new ForbiddenException('The user is not allowed for this');
    }

    return true;
  }
}
