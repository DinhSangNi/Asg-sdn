import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateDto } from 'src/dto/request/user-create.dto';
import { User, UserDocument } from 'src/entity/user.schema';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(userCreateDto: UserCreateDto): Promise<UserDocument> {
    if (await this.userRepository.findByEmail(userCreateDto.email)) {
      throw new ConflictException('Email already existed');
    }

    const newUser = await this.userRepository.create(
      userCreateDto.name,
      userCreateDto.email,
      userCreateDto.password,
    );

    return newUser;
  }
}
