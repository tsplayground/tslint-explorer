import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {
  TSLintConfig,
  TSLintRule
} from '../models';
import { TSLINT_RULE_STATUS } from '../enums';

@Injectable()
export class TSLintService {
  private tsLintConfigSubject = new ReplaySubject<TSLintConfig>();
  private tsLintConfigObservable = this.tsLintConfigSubject.asObservable();
  private tsLintConfig: TSLintConfig;

  constructor(private http: Http) {}
  public getConfig(): Observable<TSLintConfig> {
    this.http
      .get('/assets/tslint.json')
      .map(response => response.json())
      .first()
      .subscribe((tsLintConfig: TSLintConfig) => {
        this.tsLintConfig = tsLintConfig;
        this.tsLintConfig._status = {};
        this.tsLintConfig.experimentalRules = tsLintConfig.experimentalRules || [];
        if (this.tsLintConfig.experimentalRules.length) {
          this.tsLintConfig.experimentalRules.forEach(key => {
            this.setRuleStatus({
              key,
              plugin: undefined,
              url: undefined,
              value: this.tsLintConfig.rules[key]
            }, TSLINT_RULE_STATUS.MARKED_AS_EXPERIMENTAL);
          });
        }
        this.tsLintConfigSubject.next(this.tsLintConfig);
      });

    return this.tsLintConfigObservable;
  }

  public updateConfig(config: TSLintConfig): void {
    config._status = {};
    this.tsLintConfig = config;
    this.tsLintConfigSubject.next(this.tsLintConfig);
  }

  public filterRules(keywords: string): void {
    const rules = {};
    for (const key in this.tsLintConfig.rules) {
      if (!this.tsLintConfig.rules.hasOwnProperty(key) || key.indexOf(keywords) === -1) {
        continue;
      }

      rules[key] = this.tsLintConfig.rules[key];
    }

    this.tsLintConfigSubject.next({
      ...this.tsLintConfig,
      rules
    });
  }

  public approveRule(rule: TSLintRule): void {
    for (const key in this.tsLintConfig.rules) {
      if (!this.tsLintConfig.rules.hasOwnProperty(key) || key !== rule.key) {
        continue;
      }

      this.setRuleStatus(rule, TSLINT_RULE_STATUS.APPROVED);
    }

    this.tsLintConfigSubject.next(this.tsLintConfig);
  }

  public removeRule(rule: TSLintRule): void {
    for (const key in this.tsLintConfig.rules) {
      if (!this.tsLintConfig.rules.hasOwnProperty(key) || key !== rule.key) {
        continue;
      }

      this.setRuleStatus(rule, TSLINT_RULE_STATUS.REMOVED);
    }

    this.tsLintConfigSubject.next(this.tsLintConfig);
  }

  public markRuleAsExperimental(rule: TSLintRule): void {
    for (const key in this.tsLintConfig.rules) {
      if (!this.tsLintConfig.rules.hasOwnProperty(key) || key !== rule.key) {
        continue;
      }

      this.setRuleStatus(rule, TSLINT_RULE_STATUS.MARKED_AS_EXPERIMENTAL);
    }

    this.tsLintConfigSubject.next(this.tsLintConfig);
  }

  public getRuleStatus(ruleOrKey: TSLintRule | string): number {
    return this.tsLintConfig._status[this.getRuleStatusKey(
      (typeof ruleOrKey === 'string') ? ruleOrKey : ruleOrKey.key
    )];
  }

  public setRuleStatus(rule: TSLintRule, status: number): void {
    rule.status = status;
    this.tsLintConfig._status[this.getRuleStatusKey(rule.key)] = status;
  }

  public toDataURI(): string {
    const jsonFile: string = 'tslint.json';
    const file = new File([jsonFile], 'tslint.json');
    const tsLintConfig = {
      ...this.tsLintConfig,
      experimentalRules: []
    };

    for (const key in tsLintConfig.rules) {
      if (this.getRuleStatus(key) === TSLINT_RULE_STATUS.REMOVED) {
        delete tsLintConfig.rules[key];
      } else if (this.getRuleStatus(key) === TSLINT_RULE_STATUS.MARKED_AS_EXPERIMENTAL) {
        tsLintConfig.experimentalRules.push(key);
      }
    }

    delete tsLintConfig._status;

    const str = JSON.stringify(tsLintConfig, undefined, 2);

    return `data:application/json;charset=utf-8,${encodeURIComponent(str)}`;
  }

  // tslint:disable-next-line:prefer-function-over-method
  private getRuleStatusKey(key: string): string {
    return `_${key}-status`;
  }
}
