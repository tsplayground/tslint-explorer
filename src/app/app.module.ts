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

import { AppComponent } from './app.component';

import {
  MessageService,
  ProcessService,
  TSLintService
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
