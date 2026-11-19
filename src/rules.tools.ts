import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    const relPath = join('resources', 'rules', 'rules.md');

    // Thử lần lượt các base dir theo thứ tự ưu tiên:
    // 1. process.cwd() — project root (hoạt động trên Vercel: /var/task/)
    // 2. Đi ngược từ file hiện tại lên (local dev & dist)
    const baseDirs: string[] = [process.cwd()];
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i++) {
      baseDirs.push(dir);
      dir = dirname(dir);
    }

    const errors: string[] = [];
    for (const base of baseDirs) {
      const candidate = join(base, relPath);
      try {
        await access(candidate);
        return await readFile(candidate, 'utf-8');
      } catch (e) {
        errors.push(`${candidate}: ${(e as NodeJS.ErrnoException).code}`);
      }
    }

    const detail = errors.join(' | ');
    console.error('[get_rules] Tried paths:', detail);
    throw new Error(`Không tìm thấy file rules.md. Tried: ${detail}`);
  }
}

