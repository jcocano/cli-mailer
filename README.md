# cli-mailer

A small CLI to send emails in bulk by calling any HTTP API. No external dependencies—just Node.js and a `.env` file.

## Quick start

**macOS / Linux (Bash) or Windows (PowerShell, Git Bash):**

```bash
git clone <your-fork-url> cli-mailer && cd cli-mailer
npm install
npm start
```

**Windows (cmd):**

```cmd
git clone <your-fork-url> cli-mailer
cd cli-mailer
npm install
npm start
```

On first run, `.env` is created from `.env.example`. Edit `.env` with your `API_URL`, `EMAIL_TEMPLATE`, and `MAILING_LIST`, then run `npm start` again.

> **Note:** This CLI has zero dependencies — `npm install` may report that no packages were added; that’s expected. You can run `npm start` right away.

To use the CLI from anywhere: run `npm link` in this directory, then you can run `cli-mailer` from any folder.

## Requirements

- **Node.js** ≥ 24.13.1 (LTS). If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project directory to switch to the required version.

## Project structure

```
├── bin/
│   └── cli-mailer.js       # CLI entry point
├── src/
│   ├── cli.js              # Main flow and prompts
│   ├── config.js            # Env and .env loading
│   ├── mailer.js            # HTTP send logic
│   └── lib/
│       └── load-list.js     # Load and validate JSON list
├── examples/
│   └── example.json        # Sample mailing list
├── scripts/
│   └── ensure-env.js        # Ensures .env exists for tests
├── test/
│   ├── load-list.test.js
│   └── mailer.test.js
├── .env.example
├── package.json
└── README.md
```

## Configuration

### Mailing list format

The tool reads a JSON array. Each item must have at least `"to"`; the `"payload"` structure depends on your API’s template. See `examples/example.json` for reference:

```json
[
  {
    "to": "user@domain.xyz",
    "payload": {
      "account": "this.is.example"
    }
  }
]
```

### Environment variables

Copy `.env.example` to `.env` (or let the first run create it) and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `API_URL` | Yes | Base URL of your sending API (without the template id). |
| `EMAIL_TEMPLATE` | Yes | Template id your API uses. |
| `MAILING_LIST` | Yes | Path to the JSON file (e.g. `./examples/example.json`). |
| `START_AT` | No | Index to start sending from (default `0`). |
| `API_KEY` | No | If your API uses Bearer tokens (e.g. SendGrid), set this; it is sent as `Authorization: Bearer <API_KEY>`. |
| `AUTH_HEADER` | No | For other auth schemes (e.g. Mailgun Basic), set the full header value (e.g. `Basic <base64(api:your-key)>`). |
| `DRY_RUN` | No | If set to `true`, no HTTP calls are made; the CLI only logs what would be sent. |
| `DELAY_MS` | No | Delay in milliseconds between each email (e.g. `200` to wait 0.2s between sends). |

## Examples

### SendGrid

SendGrid uses a Bearer token. Create an API key in the [SendGrid dashboard](https://app.sendgrid.com/settings/api_keys), then set:

```env
API_URL=https://api.sendgrid.com/v3/
EMAIL_TEMPLATE=mail/send
MAILING_LIST=./my-list.json
API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Your JSON list should match the structure your backend or SendGrid template expects (e.g. `to`, and any template variables in `payload`).

### Mailgun

Mailgun uses HTTP Basic auth with your API key. Use your [Mailgun API key](https://app.mailgun.com/app/account/security) and domain:

```env
API_URL=https://api.mailgun.net/v3/YOUR_DOMAIN/
EMAIL_TEMPLATE=messages
MAILING_LIST=./my-list.json
AUTH_HEADER=Basic BASE64_OF_api:key
```

To build `AUTH_HEADER`:

- **macOS / Linux:** `echo -n "api:YOUR_MAILGUN_API_KEY" | base64` → then set `AUTH_HEADER=Basic <that-output>` in `.env`.
- **Windows (PowerShell):**  
  `[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("api:YOUR_MAILGUN_API_KEY"))` → use the output as `AUTH_HEADER=Basic <that-output>` in `.env`.
- **Any (Node):**  
  `node -e "console.log('Basic '+Buffer.from('api:YOUR_MAILGUN_API_KEY').toString('base64'))"` → copy the printed value into `AUTH_HEADER` in `.env`.

### Custom API (no auth)

For your own endpoint that doesn’t require authentication:

```env
API_URL=https://your-server.com/v1/send/
EMAIL_TEMPLATE=welcome
MAILING_LIST=./my-list.json
```

No `API_KEY` or `AUTH_HEADER` needed. The CLI sends a POST per recipient to `API_URL + EMAIL_TEMPLATE` with body `{ "to": "...", "payload": { ... } }`.

## Usage

After configuring `.env`:

```bash
npm start
```

Or pass variables inline:

**macOS / Linux (Bash):**

```bash
MAILING_LIST=./examples/example.json START_AT=0 node bin/cli-mailer.js
```

**Windows (cmd):**

```cmd
set MAILING_LIST=./examples/example.json && set START_AT=0 && node bin/cli-mailer.js
```

**Windows (PowerShell):**

```powershell
$env:MAILING_LIST='./examples/example.json'; $env:START_AT='0'; node bin/cli-mailer.js
```

The CLI will show how many emails will be sent and ask for confirmation (Y/N) before sending.

## Use cases

- Quickly send a transactional or notification email to a list defined in a JSON file.
- Test email templates (SendGrid, Mailgun, custom APIs) locally using `DRY_RUN` before hitting real endpoints.
- Wrap your own HTTP endpoint for bulk email sending without building a custom CLI from scratch.

## Testing

The project uses Node’s built-in test runner (no extra dependencies). Run:

```bash
npm test
```

This ensures a `.env` exists (from `.env.example` if missing), then runs unit tests for list loading/validation and for the mailer (with mocked HTTP).

## Contributing

Contributions are welcome:

- Fork the repository and create a feature branch.
- Run the CLI locally with `npm start` (or `nvm use && npm start` if you use nvm).
- Run tests with `npm test`.
- Open a pull request describing the change and how to test it.

## License

MIT © Jesus Cocaño
