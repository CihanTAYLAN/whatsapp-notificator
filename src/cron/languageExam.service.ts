import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrImage from 'qr-image';

@Injectable()
export class LanguageExamService {
  private readonly logger = new Logger(LanguageExamService.name);

  public readonly client: Client;

  private readonly genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  private readonly model: GenerativeModel;

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      },
      authStrategy: new LocalAuth({
        clientId: 'my-notificator',
        dataPath: '.data',
      }),
    });

    this.client.on('authenticated', () => {
      console.log('Authenticated');
    });

    this.client.on('auth_failure', () => {
      console.error('Auth failure!');
    });

    this.client.on('qr', (qr: string) => {
      fs.writeFileSync('.data/qr.txt', qr);
      qrImage
        .image(qr, { type: 'png' })
        .pipe(fs.createWriteStream('.data/qr.png'));
    });

    this.client.on('ready', () => {
      console.log('Connected');
      this.sendMessage(`${process.env.OWNER_NUMBER}@c.us`, "Hi, I'm up!");
      fs.rmSync('.data/qr.txt');
      fs.rmSync('.data/qr.png');
    });

    this.client.on('message', async (message) => {
      if (message.body.includes('Generate')) {
        message.reply(
          await this.generateKeywordsByTheme(
            message.body.split('Generate')[1].trim(),
          ),
        );
      }
    });

    this.client.initialize();

    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  sendMessage = async (number: string, message: string) => {
    try {
      await this.client.sendMessage(number, message);
    } catch (error) {
      console.error('an error:', error);
    }
  };

  async generateKeywordsByTheme(theme: string): Promise<string> {
    const result = await this.model.generateContent(`
Generate 5 English words and 5 sentences related to ${theme}, along with their Turkish translations. The format should be:

Word: [English] - [Turkish]
Sentence: [English sentence] - [Turkish translation]

Examples:
Hello - Merhaba
How are you? - Nasılsın?

Ensure the words and sentences are simple and suitable for English learners. Just give the output, don't give any explanation. First write the words then the sentences.`);

    return result.response.text();
  }

  async generateMyKeywordsDaily(): Promise<string> {
    const charNumber = Math.floor(Math.random() * 26) + 1;
    const result = await this.model.generateContent(`
Generate 5 English words and 5 sentences, starting with the ${charNumber}rd letter of the alphabet, along with their Turkish translations. The format should be:

Word: [English] - [Turkish]
Sentence: [English sentence] - [Turkish translation]

Examples:
Hello - Merhaba
How are you? - Nasılsın?

Ensure the words and sentences are simple and suitable for English learners. Just give the output, don't give any explanation. First write the words then the sentences.`);

    return result.response.text();
  }

  async generate(greating: string): Promise<void> {
    this.client
      .getState()
      .then(async (state) => {
        console.log('-------------------------');
        console.log('state:', state);
        if (state === 'CONNECTED') {
          console.log('greating message sending:', greating);
          this.sendMessage(
            process.env.GROUP_ID,
            greating + '\n' + (await this.generateMyKeywordsDaily()),
          );
        }
        console.log('-------------------------');
      })
      .catch((error) => {
        console.error('an error:', error);
      });
  }

  @Cron('0 0 18 * * *')
  async sendGoodEvening(): Promise<void> {
    this.generate('Good evening!');
  }
}
