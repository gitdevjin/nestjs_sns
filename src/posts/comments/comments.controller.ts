import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
    /**
     * 1. Entity
     * author, post, comment, likeCount, id, createdAt, updatedAt
     *
     * 2. GET() pagination
     *
     * 3. GET(':commentId) retrieve one comment.
     * 4. POST()
     * 5. PATCH()
     * 6. DELETE()
     */
  }
}
