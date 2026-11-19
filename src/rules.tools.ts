import { Injectable } from '@nestjs/common';
import { Tool } from '@nestjs/mcp';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Tìm và đọc file trong resources/rules/ — hoạt động cả local lẫn Vercel */
async function readRulesFile(filename: string): Promise<string> {
  const relPath = join('resources', 'rules', filename);

  // process.cwd() = /var/task/ trên Vercel (project root)
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
  console.error(`[readRulesFile:${filename}] Tried paths:`, detail);
  throw new Error(`Không tìm thấy ${filename}. Tried: ${detail}`);
}

@Injectable()
export class RulesTools {

  @Tool({
    name: 'get_rules',
    description:
      'Trả về toàn bộ nội dung file quy tắc vận hành (rules.md) dành cho AI quản lý hồ sơ vụ việc pháp lý. ' +
      'Gọi tool này đầu tiên trước mọi thao tác liên quan đến hồ sơ vụ việc để đảm bảo tuân thủ đúng quy trình.',
    annotations: { readOnlyHint: true },
  })
  getRules(): Promise<string> {
    return readRulesFile('rules.md');
  }

  @Tool({
    name: 'get_rules_examples',
    description:
      'Trả về file phụ lục ví dụ (rules_examples.md) minh hoạ cú pháp SEARCH/REPLACE và các neo dùng trong hồ sơ vụ việc. ' +
      'Dùng để học cú pháp — không phải dữ liệu hồ sơ thực tế.',
    annotations: { readOnlyHint: true },
  })
  getRulesExamples(): Promise<string> {
    return readRulesFile('rules_examples.md');
  }

  @Tool({
    name: 'get_state_template',
    description:
      'Trả về mẫu file hồ sơ vụ việc trống (state_template.md). ' +
      'Dùng khi cần khởi tạo hồ sơ mới cho một vụ việc.',
    annotations: { readOnlyHint: true },
  })
  getStateTemplate(): Promise<string> {
    return readRulesFile('state_template.md');
  }
}
