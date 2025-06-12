import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/dto/request/user-create.dto';
import { Response } from 'express';
import { ApiResponse } from 'src/dto/response/api-response.dto';
import { User } from 'src/entity/user.schema';
import { UserLoginDto } from 'src/dto/request/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          'Login sucessfully',
          await this.authService.login(body),
        ),
      );
  }

  @Post('/register')
  async register(@Body() body: UserCreateDto, @Res() res: Response) {
    console.log('body: ', body);
    return res
      .status(HttpStatus.CREATED)
      .json(
        new ApiResponse<User>(
          'Register sucessfully',
          await this.authService.register(body),
        ),
      );
  }
}
