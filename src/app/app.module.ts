import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import {
  MdButtonModule,
  MdProgressBarModule,
  MdSnackBarModule
} from '@angular/material';


import { AppComponent } from './app.component';

import {
  MessageService,
  ProcessService,
  TSLintRuleService
} from './services';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ExpansionPanelsModule,
    MdButtonModule,
    MdProgressBarModule,
    MdSnackBarModule
  ],
  providers: [
    MessageService,
    ProcessService,
    TSLintRuleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
