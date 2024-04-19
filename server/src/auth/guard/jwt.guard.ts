// we use guard to protect our api, allow to execution or not.

// in our case jwtGuard will allow the execution if the strategy condition is fulfilled.
import { AuthGuard } from '@nestjs/passport';
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
