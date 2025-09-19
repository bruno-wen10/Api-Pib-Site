import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; token: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.token, body.newPassword);
  }
}
