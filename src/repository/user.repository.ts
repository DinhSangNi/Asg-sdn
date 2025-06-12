import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entity/user.schema';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      email: email,
      deletedAt: null,
    });

    return user;
  }

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = new this.userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return savedUser;
  }
}
