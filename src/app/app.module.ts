import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';

import {
  MdButtonModule,
  MdChipsModule,
  MdIconModule,
  MdInputModule,
  MdProgressBarModule,
  MdSnackBarModule
} from '@angular/material';

import hljs from 'highlight.js';
import {
  HIGHLIGHT_JS,
  HighlightJsModule
} from 'angular-highlight-js';

import { AppComponent } from './app.component';
import { StickyDirective } from './directives';

import {
  MessageService,
  ProcessService,
  TSLintService
} from './services';

export function highlightJsFactory() {
  return hljs;
}

@NgModule({
  declarations: [
    AppComponent,
    StickyDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: highlightJsFactory
    }),
    ExpansionPanelsModule,
    MdButtonModule,
    MdChipsModule,
    MdIconModule,
    MdInputModule,
    MdProgressBarModule,
    MdSnackBarModule
  ],
  providers: [
    MessageService,
    ProcessService,
    TSLintService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
