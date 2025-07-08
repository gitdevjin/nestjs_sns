import { Injectable, NotFoundException } from '@nestjs/common';

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

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'first author',
    title: 'first title',
    content: 'first content',
    likeCount: 10,
    commentCount: 10,
  },
  {
    id: 2,
    author: 'second author',
    title: 'second title',
    content: 'second content',
    likeCount: 10,
    commentCount: 30,
  },
  {
    id: 3,
    author: 'third author',
    title: 'third title',
    content: 'third content',
    likeCount: 20,
    commentCount: 30,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostbyId(id: number): PostModel {
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  createPost(author: string, title: string, content: string): PostModel {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts = [...posts, post];

    return post;
  }

  updatePost(
    postId: number,
    author: string,
    title: string,
    content: string,
  ): PostModel {
    const post = posts.find((post) => post.id === postId);
    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));

    return post;
  }

  deletePost(postId: number) {
    const post = posts.find((post) => post.id === postId);
    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== postId);

    return postId;
  }
}
