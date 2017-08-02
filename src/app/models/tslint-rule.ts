import { SafeResourceUrl } from '@angular/platform-browser';
import { Process } from './process';

export class TSLintRule {
  public key: string;
  public url: SafeResourceUrl;
  public value: string;
  public process?: Process;
}
