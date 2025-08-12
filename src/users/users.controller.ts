import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({ nickname, email, password });
  // }

  /**
   *
   * Serialization = 직렬화 -> 현재 시스템에서 사용되는(NestJs) 데이터의 구조를 다른 시스템에서도 쉽게 사용할 수 있는 포맷으로 변환
   *                현재는 class의 object에서 json 포맷으로 변환
   * Deserialization -> 역직렬화
   *
   * getAllUsers() 로 부터 반환되는 클래스 오브젝트가 클라이언트로 전송되기 위해 json형태로 serialized 될 때 중간에 intercept해서
   * exclude를 사용 할 수 있게 하는 것이 classSerializerInterceptor 이다.
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(@User() user: UsersModel) {
    return this.usersService.getFollowers(user.id);
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number
  ) {
    await this.usersService.followUser(user.id, followeeId);
  }

  @Patch('follow/:id/confirm')
  async patchFollowConfirm(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followerId: number
  ) {
    await this.usersService.confirmFollow(followerId, user.id);

    return true;
  }

  @Delete('follow/:id')
  async deleteFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number
  ) {
    await this.usersService.deleteFollow(user.id, followeeId);

    return true;
  }
}
