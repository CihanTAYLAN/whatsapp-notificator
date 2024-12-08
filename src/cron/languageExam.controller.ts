import { Controller, Get, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import { BasicAuthGuard } from './basic-auth.guard';

@Controller('language-exam')
export class ExamController {
  @UseGuards(BasicAuthGuard)
  @Get()
  register(): string {
    if (!fs.existsSync('.data')) {
      return 'No data';
    }
    if (!fs.existsSync('.data/qr.png')) {
      return 'No data';
    }
    const qr = fs.readFileSync('.data/qr.png');
    const qrImage = qr.toString('base64');
    return `<img src="data:image/png;base64,${qrImage}"/><script>setTimeout(() => { window.location.reload(); }, 1000);</script>`;
  }
}
