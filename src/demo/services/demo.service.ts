import { Injectable } from '@nestjs/common';
import { DemoResponse } from '../interfaces/demo-response.interface';

@Injectable()
export class DemoService {
  getRateLimited(): DemoResponse {
    return {
      message: 'Allowed. Call this route more than 5 times in 10 seconds to get a 429.',
      timestamp: new Date().toISOString(),
    };
  }
}
