import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './shared/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  @Public()
  @Get()
  getVersion(): string {
    return 'API Version 1.0.0 on-line!';
  }

  @Public()
  @Get('check')
  check() {
    return {
      status: 'OK',
      message: 'API está funcionando corretamente.',
    };
  }
}

