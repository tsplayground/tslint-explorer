import {
  Component,
  OnInit
} from '@angular/core';
import { Http } from '@angular/http';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { MdSnackBar } from '@angular/material';

import { Guid } from './utils/uuid';

class TSLintRule {
  key: string;
  url: SafeResourceUrl;
  value: string;
  process?: Process;
}

class Process {
  private _id: string;
  get id(): string {
    if (this._id) {
      return this._id;
    }
    this._id = Guid.newGuid();
  }

}

const CODELYZER_RULES = [
  'angular-whitespace',
  'banana-in-box',
  'component-class-suffix',
  'component-selector',
  'directive-class-suffix',
  'directive-selector',
  'import-destructing-spacing',
  'invoke-injectable',
  'no-access-missing-member',
  'no-attribute-parameter-decorator',
  'no-forward-ref',
  'no-input-rename',
  'no-output-rename',
  'no-unused-css-rule',
  'pipe-impure',
  'pipe-naming',
  'template-to-ng-template',
  'templates-no-negated-async',
  'templates-use-public',
  'use-host-property-decorator',
  'use-input-property-decorator',
  'use-life-cycle-interface',
  'use-output-property-decorator',
  'use-pipe-decorator',
  'use-pipe-transform-interface',
  'use-view-encapsulation',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  rules: TSLintRule[] = [];
  processing: Process[] = [];
  uploadedJSON: string = 'Your uploaded rules will appear here';
  constructor(private http: Http,
              private sanitizer: DomSanitizer,
              private snackBar: MdSnackBar) { }

  ngOnInit(): void {
    const getJSONProcess = new Process();
    this.processing.push(getJSONProcess);
    this.http
      .get('/assets/tslint.json')
      .map(response => response.json())
      .take(1)
      .subscribe(tslint => {
        if (!tslint.rules) {
          this.snackBar.open('Invalid TSlint JSON file', undefined, {
            duration: 2000,
          });
        } else {
          this.rules = this.loadRules(tslint);
        }

        this.processCompleted(getJSONProcess);
      });
  }

  loadUrl(rule: TSLintRule) {
    let tslintRulePage = `https://palantir.github.io/tslint/rules/${rule.key}`;
    if (CODELYZER_RULES.indexOf(rule.key) !== -1) {
      tslintRulePage = `http://codelyzer.com/rules/${rule.key}`
    }
    rule.url = this.sanitizer.bypassSecurityTrustResourceUrl(tslintRulePage);
    this.processing.push(rule.process);
  }

  processCompleted(process: Process): void {
    const processIndex = this.processing.indexOf(process);

    if (processIndex !== -1) {
      this.processing.splice(processIndex, 1);
    }
  }

  loadRules(tslint: {
    rules: Array<any>
  }): Array<TSLintRule> {

    return Object.keys(tslint.rules).map(key => ({
      key: key,
      url: undefined,
      value: JSON.stringify(tslint.rules[key], undefined, 2),
      process: new Process()
    }));
  }

  previewJSONFile(fileInput: any) {
    const files: FileList = fileInput.files;
    if (files.length <= 0) {
      return false;
    }

    const fr = new FileReader();

    fr.onload = (e) => {
      try {
        const result = JSON.parse((e.target as any).result);
        if (!result.rules) {
          throw new Error('Invalid TSlint JSON file');
        }
        const formatted = JSON.stringify(result, null, 2);
        this.uploadedJSON = formatted;
        this.rules = this.loadRules(result);
        this.snackBar.open('TSlint rules were imported successfully', undefined, {
          duration: 2000,
        });
      } catch(error) {
        this.snackBar.open('Invalid TSlint JSON file', undefined, {
          duration: 2000,
        });
      }
    };

    fr.readAsText(files.item(0));
  }
}
