#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import concurrently from 'concurrently';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function cli() {
  try {
    const argv = await yargs(hideBin(process.argv)).argv;
    const { command, npm } = argv;

    if (!command) {
      console.log('Missing --command');
      process.exit(1);
    }

    if (!npm) {
      console.log('Missing --npm');
      process.exit(1);
    }

    switch (command) {
      case 'run-all': {
        const packages = await fs.readdir(path.join(process.cwd(), 'packages'));

        await concurrently(packages.map((packageName) => ({
          command: `npm run ${npm}`,
          name: packageName,
          cwd: path.join(process.cwd(), 'packages', packageName),
        })));

        break;
      }

      default: {
        console.log('Invalid command');
        process.exit(1);
      }
    }
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

cli();
