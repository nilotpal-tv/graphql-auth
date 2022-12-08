import { PrismaClient, User } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import isObjectID from 'bson-objectid';
import { PubSub } from 'graphql-subscriptions';
import slug from 'slug';
import { v4 as uuid } from 'uuid';
import {
  CreatePostInput,
  NEW_POST,
  Post,
  UpdatePostInput,
} from '../types/post';

const pubSub = new PubSub();

class PostService {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async postById(id: string): Promise<Post> {
    if (!isObjectID.isValid(id))
      throw new ApolloError('Provide a valid id.', '400');

    const post = await this.#prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    return post;
  }

  async postsByText(text: string): Promise<Post[]> {
    const posts = await this.#prisma.post.findMany({
      where: { title: { contains: text, mode: 'insensitive' } },
      include: { author: true },
    });

    return posts;
  }

  async createPost(createPostInput: CreatePostInput['input'], user: User) {
    const { body, title } = createPostInput;

    const uniqueSlug = slug(title);
    const existPost = await this.#prisma.post.findUnique({
      where: { slug: uniqueSlug },
    });

    if (existPost) {
      const newSlug = `${slug(title)}_${uuid()}`;
      const post = await this.#prisma.post.create({
        data: { body, title, slug: newSlug, authorId: user.id },
        include: { author: true },
      });
      pubSub.publish(NEW_POST, { postCreated: post });

      return post;
    } else {
      const post = await this.#prisma.post.create({
        data: { body, title, slug: slug(title), authorId: user.id },
        include: { author: true },
      });

      return post;
    }
  }

  async updatePost({ input }: UpdatePostInput, user: User) {
    if (!input.body || !input.id)
      throw new ApolloError('All fields are required.');

    if (!isObjectID.isValid(input.id))
      throw new ApolloError('Invalid post id.');

    const post = await this.#prisma.post.findUnique({
      where: { id: input.id },
      include: { author: true },
    });

    if (!post) throw new ApolloError("Post doesn't exist.", '404');
    if (post.authorId.toString() !== user.id.toString())
      throw new ApolloError("You can't update other user's post.", '400');

    const updatedPost = await this.#prisma.post.update({
      where: { id: post.id },
      data: { body: input.body },
      include: { author: true },
    });

    return updatedPost;
  }

  async deletePost(id: string, userId: string) {
    if (!isObjectID.isValid(id)) throw new ApolloError('Invalid post id.');

    const post = await this.#prisma.post.findUnique({ where: { id } });
    if (!post) throw new ApolloError("Post doesn't exist.", '404');

    if (post.authorId.toString() !== userId.toString())
      throw new ApolloError("You can't delete other user's post.", '400');

    await this.#prisma.post.delete({ where: { id } });
  }
}

export default new PostService();
