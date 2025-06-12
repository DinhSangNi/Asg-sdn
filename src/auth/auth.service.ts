import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/entity/user.schema';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { UserCreateDto } from 'src/dto/request/user-create.dto';
import { UserLoginDto } from 'src/dto/request/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new ConflictException('Password not match');
    }

    return user;
  }

  async generateAccessToken(user: UserDocument): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
    });

    return accessToken;
  }

  async login(
    userLoginDto: UserLoginDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.validate(userLoginDto.email, userLoginDto.password);
    return {
      accessToken: await this.generateAccessToken(user),
      user: user.toObject(),
    };
  }

  async register(userCreateDto: UserCreateDto): Promise<User> {
    return (await this.userService.create(userCreateDto)).toObject();
  }
}
