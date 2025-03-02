import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller, Get, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AllowUnauthorizedRequest } from '@mia-platform-internal/taringa-auth-library';
import AppService from './app.service';

@Controller()
@AllowUnauthorizedRequest() // <-- if you preffer to not use Taringa Auth library remove this line
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('status')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Returns the Health of the Application' })
  @Get('/status/health')
  checkConnection(): Promise<any> {
    return this.appService.getAppHealth();
  }

  @ApiTags('check-up')
  @ApiOkResponse({ description: 'Returns the Health of the Application' })
  @Get('/check-up')
  checkUp() {
    return this.appService.getAppHealth();
  }

  @ApiTags('healthz')
  @ApiOkResponse({ description: 'Returns the Application status' })
  @Get('/healthz')
  checkHeath() {
    return true;
  }

  @ApiTags('ready')
  @ApiOkResponse({ description: 'Returns true if the app is ready' })
  @Get('ready')
  checkReady() {
    return true;
  }
}
