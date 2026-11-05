import { Body, Controller, Module, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../core/storage.service';
import { CurrentUser, type AuthUser } from '../../auth/auth.decorators';
import { invalid, ok } from '../../common/http';
import { env } from '../../config/env';

const IMAGE = /^image\/(png|jpe?g|webp|gif)$/;

/** Multer config shared by every upload endpoint (images ≤ 5 MB, PDFs ≤ 10 MB). */
export const uploadInterceptor = () =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: env().UPLOAD_DIR,
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${extname(file.originalname).toLowerCase() || ''}`),
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, IMAGE.test(file.mimetype) || file.mimetype === 'application/pdf'),
  });

export function assertFile(file: Express.Multer.File | undefined, imagesOnly = false) {
  if (!file) throw invalid({ file: [imagesOnly ? 'Upload a PNG, JPEG or WebP image' : 'Upload an image or PDF'] });
  if (imagesOnly && !IMAGE.test(file.mimetype)) throw invalid({ file: ['Upload a PNG, JPEG or WebP image'] });
  if (IMAGE.test(file.mimetype) && file.size > 5 * 1024 * 1024) throw invalid({ file: ['File is larger than 5 MB'] });
  return file;
}

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  @Post()
  @UseInterceptors(uploadInterceptor())
  async upload(@CurrentUser() u: AuthUser, @UploadedFile() file: Express.Multer.File, @Body() body: { purpose?: string }) {
    assertFile(file);
    const purpose = /^[A-Z_]{1,40}$/.test(body.purpose ?? '') ? body.purpose! : 'GENERAL';
    const row = await this.prisma.upload.create({ data: { userId: u.userId, purpose, path: file.filename, url: this.storage.url(file.filename), mimeType: file.mimetype, size: file.size } });
    return ok({ id: row.id, url: row.url, mimeType: row.mimeType, size: row.size }, 'File uploaded');
  }
}

@Module({ controllers: [UploadsController] })
export class UploadsModule {}
