import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /** Login and refresh Token Logic
   * 1) user gets accessToken and refreshToekn when loggin in
   *
   * 2) user send Basic Token when loggin in
   *  ex) encode 'email:password' as Base64
   *  ex) {authorization: 'Basic {token}'}
   *
   * 3) when accessing private route, send accessToken in Header
   * ex) {authorzation: 'Bearer {token}'}
   *
   * 4) server verify token, and get user information.
   *
   * 5) expired Token should be refreshed
   *    a) we need /auth/token/access to reissue accessToken
   *    b) we need /auth/token/refresh to reissue refreshToken
   *
   */

  extractTokenFromHeader(header: string, isBearer: boolean) {
    // 'Basic {token}' => ['basic', '{token}']
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('Wrong Token');
    }

    const token = splitToken[1];

    return token;
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('only refresh token is required');
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  /**
   * Register and Login Logic
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
   *
   * 4) signToken
   *    - generate accessToken and refreshToken
   *
   *
   * 5) authenticateWithEmailandPassword
   *    - authentication logic
   *      1. check if the user(email) exists
   *      2. check password
   *      3. return user info
   * */

  /*
   * Payload
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

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }
}
