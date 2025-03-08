# WhatsApp Notificator

A NestJS-based application that sends automated WhatsApp notifications using the WhatsApp Web API.

## Features

- WhatsApp Web integration using `whatsapp-web.js`
- Automated notifications system
- Language exam notifications support
- Secure endpoints with Basic Authentication
- Timezone support (Europe/Istanbul)
- Scheduled tasks using `@nestjs/schedule`

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- WhatsApp account with an active phone number

## Installation

```bash
# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000                   # Application port
OWNER_NUMBER=14333333333    # Your WhatsApp number with country code
GEMINI_API_KEY=xxxxx       # Your Google Gemini API key
BASIC_AUTH_USERNAME=example # Basic auth username for endpoints
BASIC_AUTH_PASSWORD=example # Basic auth password for endpoints
```

You can copy the `.env.example` file and modify it according to your needs:

```bash
cp .env.example .env
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Initial Setup and WhatsApp Connection

After starting the application, follow these steps to connect your WhatsApp account:

1. Navigate to `http://localhost:3000/language-exam` in your web browser
2. You will see a QR code on the terminal
3. Open WhatsApp on your phone
4. Go to Settings > WhatsApp Web/Desktop
5. Scan the QR code displayed on your terminal
6. Wait for the connection to be established
7. Once connected, you will see "Client is ready!" message in the terminal

Note: You need to scan the QR code only once. The session will be saved for future use unless you log out from WhatsApp Web.

## Docker Support

The application includes Docker support. To build and run using Docker:

```bash
# Build the Docker image
docker build -t whatsapp-notificator .

# Run the container
docker run -p 3000:3000 whatsapp-notificator
```

## Project Structure

```
src/
├── app.module.ts        # Main application module
├── cron/               # Scheduled tasks and notifications
│   ├── languageExam.controller.ts
│   ├── languageExam.service.ts
│   └── basic-auth.guard.ts
```

## Security

- Basic Authentication for protected endpoints
- Environment-based configuration
- Secure WhatsApp Web integration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support & Community

- 📫 Author: Cihan TAYLAN
  - Website: [cihantaylan.com](https://cihantaylan.com)
  - GitHub: [@cihantaylan](https://github.com/cihantaylan)
  - LinkedIn: [cihantaylan](https://www.linkedin.com/in/cihantaylan/)

### Issue Reporting

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/cihanTAYLAN/grpc-boilerplate-realtime/issues) or reach out on [X](https://x.com/cihantaylan24).

---

<div align="center">
  <sub>Built with ❤️ by Cihan TAYLAN</sub>
  <br>
  ⭐ Don't forget to star this project if you found it helpful!
</div>
