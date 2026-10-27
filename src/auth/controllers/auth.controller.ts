import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RateLimit } from 'nestjs-shield';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { PublicUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: AuthenticatedRequest): Promise<PublicUser> {
    return this.authService.getProfile(request.user.sub);
  }

  @Post('register')
  @RateLimit({ limit: 5, ttl: 60_000 })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @RateLimit({ limit: 5, ttl: 60_000 })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }
}
