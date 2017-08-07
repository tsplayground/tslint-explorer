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
        tsLintConfig._status = {};
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

  // tslint:disable-next-line:prefer-function-over-method
  private getRuleStatusKey(key: string): string {
    return `_${key}-status`;
  }
}
