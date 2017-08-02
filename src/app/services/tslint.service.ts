import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { TSLintConfig } from '../models';

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
        this.tsLintConfigSubject.next(this.tsLintConfig);
      });

    return this.tsLintConfigObservable;
  }

  public updateConfig(config: TSLintConfig): void {
    this.tsLintConfig = config;
    this.tsLintConfigSubject.next(this.tsLintConfig);
  }

  public filterRules(keywords: string): void {
    const rules = {};
    for (const i in this.tsLintConfig.rules) {
      if (!this.tsLintConfig.rules.hasOwnProperty(i) || i.indexOf(keywords) === -1) {
        continue;
      }

      rules[i] = this.tsLintConfig.rules[i];
    }

    this.tsLintConfigSubject.next({
      ...this.tsLintConfig,
      rules
    });
  }
}
