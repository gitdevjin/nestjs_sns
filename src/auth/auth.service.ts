import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * To do
   *
   * 1) registerWithEmail
   *    - email, nickname, password,
   *    - return accessToken, refreshToken
   *
   * 2) loginWithEmail
   *    - enter email and password,
   *    - return accessToken and refreshToken
   *
   * 3) loginUser
   *    - function that returns accessToekn and refreshToken
   *
   * 4) signToken
   *    - generate accessToken and refreshToken
   *
   *
   *
   *
   */

  /**
   * payload
   * 1. email
   * 2. sub -> id
   * 3. type : 'access' or 'refresh'
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /*
  5) authenticateWithEmailandPassword
   *    - authentication logic
   *      1. check if the user(email) exists
   *      2. check password
   *      3. return user info
   * */
  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException("User doesn't exist");
    }

    /**
     * 1. entered password
     * 2. stored hash
     */
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('Wrong Password');
    }

    return existingUser;
  }
}
