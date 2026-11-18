import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { McpModule } from '@nestjs/mcp';
import { HelloTools } from './hello.tools.js';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'hello-mcp-server',
      version: '1.0.0',
      instructions: 'MCP Server thử nghiệm cung cấp công cụ gửi lời chào.',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HelloTools],
})
export class AppModule {}
