import { computed, Injectable, signal } from "@angular/core";
import { CurrentPortal } from "@interfaces/currentPortal.interface";
import { InsuredUser } from "@interfaces/services.interface";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  constructor() {}
  private _currentUser = signal<InsuredUser | null>(null);
  public currentUser = computed(() => this._currentUser());

  private _currentPortal = signal<CurrentPortal | null>(null);
  public currentPortal = computed(() => this._currentPortal());


  public setInsuredUser(user: InsuredUser): boolean {
    this._currentUser.set(user);
    return true;
  }
  public setAgendamientoInsuredUser(idAgendamiento:string): boolean {
    this._currentUser.update(user=>{
      if (user) {
        return { ...user, idAgendamiento: idAgendamiento };
      }
      return user;
    });
    return true;
  }
  public setCreatePacienteInsuredUser(): boolean {
    this._currentUser.update(user=>{
      if (user) {
        return { ...user, createPaciente: true };
      }
      return user;
    });
    return true;
  }
  public setRetry(): boolean {
    let currentUserr = this.currentUser();
    let currentRetry = currentUserr?.retry;
      currentRetry = currentRetry! + 1;
    this._currentUser.update(user=>{
      if (user) {
        return { ...user, retry: currentRetry };
      }
      return user;
    });
    return true;
  }
  public setRestartRetry(): boolean {
    let currentUserr = this.currentUser();
    let currentRetry = currentUserr?.retry!;
    if (currentRetry) {
      currentRetry = 0;
    }
    this._currentUser.update(user=>{
      if (user) {
        return { ...user, retry: currentRetry };
      }
      return user;
    });
    return true;
  }
  public setTypePage(portal: CurrentPortal): boolean {
    this._currentPortal.set(portal);
    return true;
  }
  public resetData() {
    this._currentPortal.set(null);
    this._currentUser.set(null);
  }
}
