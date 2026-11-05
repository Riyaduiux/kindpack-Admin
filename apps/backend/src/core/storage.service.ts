import { Injectable } from '@nestjs/common';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { env } from '../config/env';

/** Local disk storage served at /uploads (mount a volume in production). */
@Injectable()
export class StorageService {
  readonly dir = resolve(env().UPLOAD_DIR);

  constructor() {
    mkdirSync(this.dir, { recursive: true });
  }

  url(fileName: string) {
    return `${env().PUBLIC_URL.replace(/\/$/, '')}/uploads/${fileName}`;
  }

  path(fileName: string) {
    return join(this.dir, fileName);
  }
}
