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
export class TSLintRuleService {
  private tslintRulesSubject = new ReplaySubject();
  private tsLintRules = this.tslintRulesSubject.asObservable();

  constructor(private http: Http) {}
  public list(): Observable<TSLintConfig> {
    this.http
      .get('/assets/tslint.json')
      .map(response => response.json())
      .first()
      .subscribe((tslintConfig: TSLintConfig) => {
        this.tslintRulesSubject.next(tslintConfig)
      });

    return this.tslintRulesSubject;
  }
}
