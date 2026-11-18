
import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import * as z from 'zod';

@Injectable()
export class HelloTools {

  @Tool({
    name: 'greet',
    description:
      'Gửi lời chào đến một người theo tên được cung cấp. Sử dụng tool này khi người dùng muốn tạo lời chào.',

    inputSchema: z.object({
      name: z.string()
        .min(1)
        .describe('Tên người cần gửi lời chào'),
    }),

    annotations: {
      readOnlyHint: true,
    },
  })
  greet({ name }: { name: string }): string {

    return `Xin chào ${name}! MCP Server của bạn đang hoạt động.`;

  }
}
