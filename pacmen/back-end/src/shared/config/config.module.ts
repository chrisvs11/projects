import { Module, Global } from "@nestjs/common";

import { ConfigService } from "./config.service";



@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: []
})
export class ConfigModule {
  constructor(private configService: ConfigService) {
  }
}