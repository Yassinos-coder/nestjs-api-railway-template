import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { PublicUser, User } from '../interfaces/user.interface';
import { UserMapper } from '../mappers/user.mapper';
import { UsersRepository } from '../repositories/users.repository';

const BCRYPT_ROUNDS = 12;
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return UserMapper.toPublic(user);
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersRepository.create(this.normalizeEmail(dto.email), passwordHash);

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(this.normalizeEmail(dto.email));
    const passwordMatches = await bcrypt.compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !passwordMatches) throw new UnauthorizedException('Invalid email or password');

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const expiresInSeconds = this.config.getOrThrow<number>('jwt.expiresInSeconds');
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { accessToken, expiresInSeconds, user: UserMapper.toPublic(user) };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
