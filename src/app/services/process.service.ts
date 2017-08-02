import { Injectable } from '@angular/core';
import { Process } from '../models';
import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx';

@Injectable()
export class ProcessService {
  private processes: Array<Process> = [];
  private processesSubject = new ReplaySubject<Array<Process>>();
  private processesObservable = this.processesSubject.asObservable();
  public list(): Observable<Array<Process>> {
    return this.processesObservable;
  }
  public start(process: Process): void {
    this.processes.push(process);
    this.processesSubject.next(this.processes);
  }
  public complete(process: Process): void {
    const processIndex = this.processes.indexOf(process);
    if (processIndex !== -1) {
      this.processes.splice(processIndex, 1);
      this.processesSubject.next(this.processes);
    }
  }
}
