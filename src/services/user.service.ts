import { PrismaClient } from '@prisma/client';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import {
  LoginUserInput,
  RegisterUserInput,
  UpdateUserInput,
  User,
} from '../types/user';
import hashService from './hash.service';
import tokenService from './token.service';

class UserService {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  checkIfLoggedIn(user: User) {
    if (!user || !user.id) throw new AuthenticationError('You need to login.');
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) throw new ApolloError('Email is a required attribute.', '400');
    const user = await this.#prisma.user.findUnique({ where: { email } });
    return user;
  }

  async register(registerInput: RegisterUserInput['input']): Promise<User> {
    const { email, firstName, lastName, password } = registerInput;
    const existUser = await this.#prisma.user.findUnique({ where: { email } });

    if (existUser) throw new ApolloError('Email is already registered', '409');

    const hashedPassword = await hashService.hashPassword(password);
    const user = await this.#prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });
    return user;
  }

  async login(loginInput: LoginUserInput['input']): Promise<string> {
    const { email, password } = loginInput;

    if (!email || !password)
      throw new ApolloError('All fields are required', '400');

    const user = await this.#prisma.user.findUnique({ where: { email } });
    if (!user) throw new AuthenticationError('Invalid email or password.');

    const isMatchPassword = await hashService.comparePassword(
      password,
      user.password
    );

    if (!isMatchPassword)
      throw new AuthenticationError('Invalid email or password.');

    const token = tokenService.generateTokens({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.id,
    });
    return token;
  }

  async deleteAccount(id: string) {
    await this.#prisma.user.delete({ where: { id } });
  }

  async updateInfo(
    id: string,
    updateInfo: UpdateUserInput['input']
  ): Promise<User> {
    const updatedUser = await this.#prisma.user.update({
      where: { id },
      data: { ...updateInfo },
    });
    return updatedUser;
  }
}

export default new UserService();
