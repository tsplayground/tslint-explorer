import { TSLintRule } from './tslint-rule';

export class TSLintConfig {
  public rules: Array<TSLintRule>;
  public rulesDirectory: Array<string>;
  public extends: Array<string>;
}
