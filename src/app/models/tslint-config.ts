import { TSLintRule } from './tslint-rule';

export class TSLintConfig {
  public rules: {
    [key: string]: any
  };
  public rulesDirectory: string[];
  public extends: string[];
  public _status: {
    [key: string]: number
  };
}
