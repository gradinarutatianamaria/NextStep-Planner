import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const replitChromium = '/repl/tools/bin/chromium';
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  (existsSync(replitChromium) ? replitChromium : undefined);

export default defineConfig({
  testDir: './e2e',
  outputDir: resolve(import.meta.dirname, '../../generated-artifacts/nextstep-playwright'),
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    headless: true,
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: 'pnpm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4174/',
    env: {
      PORT: '4174',
      BASE_PATH: '/',
    },
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
