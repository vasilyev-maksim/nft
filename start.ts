import { ChildProcess, spawn } from 'child_process';
import { createWriteStream } from 'node:fs';
import { join } from 'path';
import { Transform, TransformOptions } from 'stream';

class PrefixerTransform extends Transform {
  constructor(private readonly prefix: string, { encoding, ...options }: TransformOptions = {}) {
    super({ ...options, defaultEncoding: 'utf8', decodeStrings: true });
  }

  _transform(chunk: string, encoding: string, callback: Function) {
    callback(null, `[${this.prefix}] ${chunk.toString().trim()}\n`, 'utf8');
  }
}

class Project {
  public constructor(private readonly directory: string, private readonly rootProcess: NodeJS.Process) {}

  public start(): ChildProcess {
    const path = join(this.rootProcess.cwd(), this.directory);
    const cmdStr = `cd ${path} && npm i && npm start`;

    const prefix = new PrefixerTransform(this.directory);
    const logWriteStream = createWriteStream(join(this.rootProcess.cwd(), 'logs', this.directory + '.txt'), {
      flags: 'a',
    });
    prefix.pipe(this.rootProcess.stdout);

    const child = spawn(cmdStr, { shell: true });
    child.stdout.pipe(prefix);
    child.stdout.pipe(logWriteStream);

    return child;
  }
}

async function main() {
  const apiStarter = new Project('api', process);
  const clientStarter = new Project('client', process);

  apiStarter.start();
  clientStarter.start();
}

main();
