import { Injectable, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingPageService {

  constructor() {
  }

  private showLoading = new BehaviorSubject<boolean>(false);
  showLoading$ = this.showLoading.asObservable();

  private submitButtonDisabled = new BehaviorSubject<boolean>(false);
  submitButtonDisabled$ = this.submitButtonDisabled.asObservable();

  setLoading(show: boolean) {
    this.showLoading.next(show);
  }
  setDisabledButton(disabled: boolean) {
    this.submitButtonDisabled.next(disabled);
  }
  
}