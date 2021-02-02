import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnDestroy {
  @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;
  private closeSub: Subscription;
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router,private componentFactoryResolver: ComponentFactoryResolver) {}

  onSwichMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formulario: NgForm) {
    if (!formulario.valid) {
      return;
    }

    const email = formulario.value.email;
    const pass = formulario.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, pass);
    } else {
      authObs = this.authService.signup(email, pass);
    }

    authObs.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;  // Se mantiene esta linea por el historico
        this.showErrorAlert(this.error);
        this.isLoading = false;
      }
    );
    formulario.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) { this.closeSub.unsubscribe() };
  }
}