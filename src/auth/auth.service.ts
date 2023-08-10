import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('Error in credentials');
      }
    }
  }
  login() {
    return {
      message: 'Login',
    };
  }
}
