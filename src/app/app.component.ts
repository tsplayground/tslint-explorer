import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Rx';
import {
  Process,
  TSLintConfig,
  TSLintRule
} from './models';
import {
  MessageService,
  ProcessService,
  TSLintService
} from './services';
import { TSLINT_RULE_STATUS } from './enums';
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
  'use-view-encapsulation'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  public rules: TSLintRule[] = [];
  public processes: Process[] = [];
  public uploadedJSON = 'Your uploaded rules will appear here';
  public keywords = '';
  private tslintRuleStatus = TSLINT_RULE_STATUS;
  private getJSONProcess: Process;
  private tslintRuleSubscription: Subscription;
  private processesSubscription: Subscription;
  constructor(private sanitizer: DomSanitizer,
              private messageService: MessageService,
              private processService: ProcessService,
              private tslintService: TSLintService) { }

  public ngOnInit(): void {
    this.processesSubscription = this.processService.list()
      .subscribe(processes => this.processes = processes);
    this.getJSONProcess = new Process();
    this.processService.start(this.getJSONProcess);
    this.tslintRuleSubscription = this.tslintService.getConfig().subscribe(tslint => {
        if (!tslint.rules) {
          this.messageService.toast('Invalid TSLint JSON file');
        } else {
          this.rules = this.loadRules(tslint);
        }

        this.processService.complete(this.getJSONProcess);
      });
  }

  public ngOnDestroy(): void {
    if (this.tslintRuleSubscription) {
      this.tslintRuleSubscription.unsubscribe();
    }

    if (this.processesSubscription) {
      this.processesSubscription.unsubscribe();
    }
  }

  public activeRule(rule: TSLintRule): void {
    this.loadUrl(rule);
    // TODO: Reopen accordion after reload rule
  }

  public loadUrl(rule: TSLintRule): void {
    let tslintRulePage = `https://palantir.github.io/tslint/rules/${rule.key}`;
    if (CODELYZER_RULES.indexOf(rule.key) !== -1) {
      tslintRulePage = `http://codelyzer.com/rules/${rule.key}`;
    }
    rule.url = this.sanitizer.bypassSecurityTrustResourceUrl(tslintRulePage);
    this.processes.push(rule.process);
  }

  public loadRules(tslint: TSLintConfig): TSLintRule[] {

    return Object.keys(tslint.rules).map(key => ({
      key,
      url: undefined,
      plugin: (CODELYZER_RULES.indexOf(key) !== -1) ? 'codelyzer' : undefined,
      value: JSON.stringify(tslint.rules[key], undefined, 2),
      status: this.tslintService.getRuleStatus(key),
      process: new Process()
    }))
    .sort((prevRule, rule) => {
      return (prevRule.key < rule.key) ? -1 :
        (prevRule.key > rule.key) ? 1 : 0;
    });
  }

  public previewJSONFile(fileInput: any): void {
    const files: FileList = fileInput.files;
    if (files.length <= 0) {
      return;
    }

    const fr = new FileReader();

    fr.onload = (e: Event) => {
      try {
        const result = JSON.parse((e.target as any).result);
        if (!result.rules) {
          throw new Error('Invalid TSLint JSON file');
        }
        const formatted = JSON.stringify(result, undefined, 2);
        this.uploadedJSON = formatted;
        this.rules = this.loadRules(result);
        this.tslintService.updateConfig(result);
        this.messageService.toast('TSLint rules were imported successfully');
      } catch (error) {
        this.messageService.toast('Invalid TSLint JSON file');
      }
    };

    fr.readAsText(files.item(0));
  }

  public keywordsChange(event: any): void {
    if (!this.isKeywordsValid() && !/(Backspace|Shift|CapsLock|Insert|Delete)/.test(event.key)) {
      this.messageService.toast('Invalid key string');

      return;
    }

    this.processService.start(this.getJSONProcess);
    this.tslintService.filterRules(this.keywords);
  }

  public approveRule(rule: TSLintRule): void {
    this.tslintService.approveRule(rule);
  }

  public removeRule(rule: TSLintRule): void {
    this.tslintService.removeRule(rule);
  }

  public markRuleAsExperimental(rule: TSLintRule): void {
    this.tslintService.markRuleAsExperimental(rule);
  }

  private isKeywordsValid(): boolean {
    return this.keywords && !/[^a-z-]/.test(this.keywords);
  }
}
