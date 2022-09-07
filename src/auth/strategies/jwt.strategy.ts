import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Request as RequestType } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from './../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import config from '../../config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const validate = req.cookies && 'access_token' in req.cookies;
    if (validate) return req.cookies.access_token;
    return null;
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const query = await this._userRepository.createQueryBuilder('user');
    const user = await query.where('user.id = :id', { id }).getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('User is not active');
    return user;
  }
}
