import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class RulesTools {

  @Tool({
    name: 'get_rules',
    description:
      'Trả về toàn bộ nội dung file quy tắc vận hành (rules.md) dành cho AI quản lý hồ sơ vụ việc pháp lý. ' +
      'Gọi tool này đầu tiên trước mọi thao tác liên quan đến hồ sơ vụ việc để đảm bảo tuân thủ đúng quy trình.',
    annotations: {
      readOnlyHint: true,
    },
  })
  async getRules(): Promise<string> {
    // Khi build production: dist/resources/rules/rules.md
    // Khi chạy dev (ts-node / watch): ../resources/rules/rules.md
    const candidates = [
      join(import.meta.dirname, 'resources', 'rules', 'rules.md'),
      join(import.meta.dirname, '..', 'resources', 'rules', 'rules.md'),
    ];

    for (const rulesPath of candidates) {
      try {
        return await readFile(rulesPath, 'utf-8');
      } catch {
        // thử path tiếp theo
      }
    }

    throw new Error(
      'Không tìm thấy file rules.md. Đảm bảo resources/rules/rules.md tồn tại trong dự án.',
    );
  }
}

