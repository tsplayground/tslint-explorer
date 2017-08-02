import { TSLintRule } from './tslint-rule';

export class TSLintConfig {
  public rules: {
    [key: string]: any
  };
  public rulesDirectory: Array<string>;
  public extends: Array<string>;
}
