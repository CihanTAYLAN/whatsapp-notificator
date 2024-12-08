import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      throw new UnauthorizedException('Authentication is required');
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      throw new UnauthorizedException('Invalid authorization format');
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString('utf-8')
      .split(':');

    if (
      username !== process.env.BASIC_AUTH_USERNAME ||
      password !== process.env.BASIC_AUTH_PASSWORD
    ) {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
      throw new UnauthorizedException('Invalid username or password');
    }

    return true;
  }
}
