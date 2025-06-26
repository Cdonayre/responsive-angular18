import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  MatButton,
  MatButtonModule,
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle,
  MatError,
  MatFormField,
  MatIcon,
  MatIconModule,
  MatInput,
  MatInputModule,
  MatLabel,
  MatSidenavModule,
  MatSuffix,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
  require_sweetalert2_all,
  ɵNgNoValidate
} from "./chunk-R6VCE5FS.js";
import {
  AuthService,
  ROUTE_PATHS,
  Router,
  RouterModule
} from "./chunk-FBN4GXPF.js";
import "./chunk-3O6RLXS5.js";
import {
  CommonModule,
  NgIf,
  Subject,
  __toESM,
  inject,
  signal,
  take,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-7SPA2HJF.js";

// src/app/shared/footer/footer.component.ts
var FooterComponent = class _FooterComponent {
  static \u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 0, template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "footer works!");
      \u0275\u0275elementEnd();
    }
  } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src\\app\\shared\\footer\\footer.component.ts", lineNumber: 10 });
})();

// src/app/shared/message-card/message-card.component.ts
var MessageCardComponent = class _MessageCardComponent {
  message;
  static \u0275fac = function MessageCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MessageCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MessageCardComponent, selectors: [["app-message-card"]], inputs: { message: "message" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 1, consts: [["appearance", "outlined", 1, "message-error"]], template: function MessageCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "mat-card", 0)(1, "mat-card-content");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.message);
    }
  }, dependencies: [MatCardModule, MatCard, MatCardContent], styles: ["\n\n.message-error[_ngcontent-%COMP%] {\n  background-color: red;\n  color: white;\n  font-size: 12px;\n}\n/*# sourceMappingURL=message-card.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MessageCardComponent, { className: "MessageCardComponent", filePath: "src\\app\\shared\\message-card\\message-card.component.ts", lineNumber: 11 });
})();

// src/app/auth/components/login/login.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
function LoginComponent_mat_card_subtitle_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card-subtitle", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subTitleLogin);
  }
}
function LoginComponent_form_12_mat_error_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " El correo electr\xF3nico es **requerido**. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_form_12_mat_error_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Ingrese un correo electr\xF3nico **v\xE1lido**. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_form_12_mat_error_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " La contrase\xF1a es **requerida**. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_form_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_form_12_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmitFirstStep());
    });
    \u0275\u0275elementStart(1, "mat-form-field", 11)(2, "mat-label");
    \u0275\u0275text(3, "Correo Electr\xF3nico");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 12);
    \u0275\u0275elementStart(5, "mat-icon", 13);
    \u0275\u0275text(6, "email");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, LoginComponent_form_12_mat_error_7_Template, 2, 0, "mat-error", 14)(8, LoginComponent_form_12_mat_error_8_Template, 2, 0, "mat-error", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "mat-form-field", 15)(10, "mat-label");
    \u0275\u0275text(11, "Contrase\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 16);
    \u0275\u0275elementStart(13, "button", 17);
    \u0275\u0275listener("click", function LoginComponent_form_12_Template_button_click_13_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.hidePassw($event));
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, LoginComponent_form_12_mat_error_16_Template, 2, 0, "mat-error", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 18);
    \u0275\u0275text(18, " Iniciar Sesi\xF3n ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_8_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.formLogin);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ((tmp_2_0 = ctx_r0.formLogin.get("email")) == null ? null : tmp_2_0.hasError("required")) && ((tmp_2_0 = ctx_r0.formLogin.get("email")) == null ? null : tmp_2_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_3_0 = ctx_r0.formLogin.get("email")) == null ? null : tmp_3_0.hasError("email")) && ((tmp_3_0 = ctx_r0.formLogin.get("email")) == null ? null : tmp_3_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("type", ctx_r0.hide() ? "password" : "text");
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Hide password")("aria-pressed", ctx_r0.hide());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.hide() ? "visibility_off" : "visibility");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_8_0 = ctx_r0.formLogin.get("password")) == null ? null : tmp_8_0.hasError("required")) && ((tmp_8_0 = ctx_r0.formLogin.get("password")) == null ? null : tmp_8_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formLogin.invalid);
  }
}
function LoginComponent_form_13_mat_error_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " El nombre de usuario es **requerido**. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_form_13_mat_error_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " La clave es **requerida**. ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_form_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function LoginComponent_form_13_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmitFirstStep());
    });
    \u0275\u0275elementStart(1, "mat-form-field", 11)(2, "mat-label");
    \u0275\u0275text(3, "Nombre de Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 19);
    \u0275\u0275elementStart(5, "mat-icon", 13);
    \u0275\u0275text(6, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, LoginComponent_form_13_mat_error_7_Template, 2, 0, "mat-error", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-form-field", 15)(9, "mat-label");
    \u0275\u0275text(10, "Clave");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 20);
    \u0275\u0275elementStart(12, "button", 17);
    \u0275\u0275listener("click", function LoginComponent_form_13_Template_button_click_12_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.hidePassw($event));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(15, LoginComponent_form_13_mat_error_15_Template, 2, 0, "mat-error", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 18);
    \u0275\u0275text(17, " Iniciar Sesi\xF3n ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.formLoginUser);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ((tmp_2_0 = ctx_r0.formLoginUser.get("usuario")) == null ? null : tmp_2_0.hasError("required")) && ((tmp_2_0 = ctx_r0.formLoginUser.get("usuario")) == null ? null : tmp_2_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("type", ctx_r0.hide() ? "password" : "text");
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Hide password")("aria-pressed", ctx_r0.hide());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.hide() ? "visibility_off" : "visibility");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_7_0 = ctx_r0.formLoginUser.get("clave")) == null ? null : tmp_7_0.hasError("required")) && ((tmp_7_0 = ctx_r0.formLoginUser.get("clave")) == null ? null : tmp_7_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formLoginUser.invalid);
  }
}
var LoginComponent = class _LoginComponent {
  titleLogin = "DIRIS LIMA NORTE";
  subTitleLogin = "";
  formLogin = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });
  formLoginUser = new FormGroup({
    usuario: new FormControl("", [Validators.required]),
    clave: new FormControl("", [Validators.required])
  });
  unsubscribe$ = new Subject();
  hide = signal(true);
  authService = inject(AuthService);
  router = inject(Router);
  tipoLogin = "main";
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([ROUTE_PATHS.DASHBOARD]);
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
  onSubmitFirstStep() {
    let loginRequest;
    let loginObservable;
    if (this.tipoLogin === "main") {
      if (this.formLogin.invalid) {
        this.formLogin.markAllAsTouched();
        this.showErrorAlert("Formulario Inv\xE1lido", "Por favor, ingrese un correo electr\xF3nico y contrase\xF1a v\xE1lidos.");
        return;
      }
      loginRequest = {
        email: this.formLogin.get("email")?.value || "",
        password: this.formLogin.get("password")?.value || ""
      };
      loginObservable = this.authService.loginAuth(loginRequest);
      loginObservable.pipe(take(1)).subscribe({
        next: () => {
          if (this.authService.isAuthenticated()) {
            import_sweetalert2.default.fire({
              icon: "success",
              title: "\xA1Bienvenido!",
              text: "Inicio de sesi\xF3n exitoso.",
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([ROUTE_PATHS.DASHBOARD]);
            });
          } else {
            this.showErrorAlert("Error de autenticaci\xF3n", "Inicio de sesi\xF3n incompleto. Int\xE9ntelo de nuevo.");
          }
        },
        error: (error) => {
          this.showErrorAlert("Error de Autenticaci\xF3n", error?.error?.data?.message || "Credenciales inv\xE1lidas o error del servidor.");
        }
      });
    } else {
      if (this.formLoginUser.invalid) {
        this.formLoginUser.markAllAsTouched();
        this.showErrorAlert("Formulario Inv\xE1lido", "Por favor, ingrese un nombre de usuario y clave v\xE1lidos.");
        return;
      }
      loginRequest = {
        usuario: this.formLoginUser.get("usuario")?.value || "",
        clave: this.formLoginUser.get("clave")?.value || ""
      };
      loginObservable = this.authService.loginUser(loginRequest);
      loginObservable.pipe(take(1)).subscribe({
        next: () => {
          if (this.authService.isAuthenticated()) {
            import_sweetalert2.default.fire({
              icon: "success",
              title: "\xA1Bienvenido!",
              text: "Inicio de sesi\xF3n exitoso.",
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([ROUTE_PATHS.DASHBOARD]);
            });
          } else {
            this.showErrorAlert("Error de autenticaci\xF3n", "Inicio de sesi\xF3n incompleto. Int\xE9ntelo de nuevo.");
          }
        },
        error: (error) => {
          this.showErrorAlert("Error de Autenticaci\xF3n", error?.error?.data?.message || "Credenciales inv\xE1lidas o error del servidor.");
        }
      });
    }
  }
  switchLoginType(type) {
    this.tipoLogin = type;
    this.formLogin.reset();
    this.formLoginUser.reset();
  }
  showErrorAlert(title, message) {
    import_sweetalert2.default.fire({
      icon: "error",
      title,
      text: message,
      confirmButtonColor: "#f44336"
    });
  }
  hidePassw(__event) {
    this.hide.update((current) => !current);
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 15, vars: 6, consts: [[1, "flex", "items-center", "justify-center", "min-h-screen", "bg-gray-100", "dark:bg-gray-900"], [1, "w-full", "max-w-md", "p-8", "shadow-xl", "rounded-lg", "bg-white", "dark:bg-gray-800"], [1, "text-center", "mb-6"], [1, "text-3xl", "font-extrabold", "text-blue-700", "dark:text-blue-400"], ["class", "text-gray-600 dark:text-gray-400 mt-2", 4, "ngIf"], [1, "flex", "justify-center", "mb-6", "space-x-4"], ["mat-flat-button", "", 1, "flex-1", 3, "click", "color"], [3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "text-center", "mt-6", "text-sm", "text-gray-500", "dark:text-gray-500"], [1, "text-gray-600", "dark:text-gray-400", "mt-2"], [3, "ngSubmit", "formGroup"], [1, "w-full", "mb-4"], ["matInput", "", "formControlName", "email", "type", "email", "placeholder", "ejemplo@dirisln.gob.pe", "required", ""], ["matSuffix", ""], [4, "ngIf"], [1, "w-full", "mb-6"], ["matInput", "", "formControlName", "password", "required", "", 3, "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "w-full", "py-2", "text-lg", 3, "disabled"], ["matInput", "", "formControlName", "usuario", "type", "text", "placeholder", "Su nombre de usuario", "required", ""], ["matInput", "", "formControlName", "clave", "required", "", 3, "type"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "mat-card", 1)(2, "mat-card-header", 2)(3, "mat-card-title", 3);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, LoginComponent_mat_card_subtitle_5_Template, 2, 1, "mat-card-subtitle", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "mat-card-content")(7, "div", 5)(8, "button", 6);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_8_listener() {
        return ctx.switchLoginType("main");
      });
      \u0275\u0275text(9, " Establecimientos ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 6);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_10_listener() {
        return ctx.switchLoginType("user");
      });
      \u0275\u0275text(11, " Usuario ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(12, LoginComponent_form_12_Template, 19, 9, "form", 7)(13, LoginComponent_form_13_Template, 18, 8, "form", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "mat-card-footer", 8);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.titleLogin);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.subTitleLogin);
      \u0275\u0275advance(3);
      \u0275\u0275property("color", ctx.tipoLogin === "main" ? "primary" : "basic");
      \u0275\u0275advance(2);
      \u0275\u0275property("color", ctx.tipoLogin === "user" ? "primary" : "basic");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.tipoLogin === "main");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.tipoLogin === "user");
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    MatSidenavModule,
    MatCardModule,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    RouterModule,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    MatInputModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatError,
    MatSuffix,
    MatIconModule,
    MatIcon,
    MatButton
  ], styles: ["\n\n.form[_ngcontent-%COMP%] {\n  width: 70%;\n  position: absolute;\n  top: 15%;\n  left: 15%;\n}\n.form[_ngcontent-%COMP%]   .form-actions__input[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.form[_ngcontent-%COMP%]   .form-actions__text[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n}\n.form[_ngcontent-%COMP%]   .form-actions__img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 70px;\n}\n.formSecond[_ngcontent-%COMP%] {\n  @extend .form;\n  top: 3%;\n  width: 90%;\n  left: 5%;\n}\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 20px;\n}\n.form-actions__login[_ngcontent-%COMP%] {\n  margin-right: 10px;\n}\n.form-actions__forget[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: bold;\n  color: #000000 !important;\n  text-decoration: underline;\n}\n.mat-form-field-label[_ngcontent-%COMP%] {\n  color: blue;\n}\n.text-cumplimiento[_ngcontent-%COMP%] {\n  text-align: justify;\n}\n.btn-login.mat-mdc-raised-button[disabled][_ngcontent-%COMP%] {\n  --tw-bg-opacity: 1 !important;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1)) !important;\n  --tw-text-opacity: 1 !important;\n  color: rgb(55 65 81 / var(--tw-text-opacity, 1)) !important;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\auth\\components\\login\\login.component.ts", lineNumber: 57 });
})();

// src/app/auth/layout/auth-page/auth-page.component.ts
function AuthPageComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-login");
  }
}
function AuthPageComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "img", 3)(1, "br")(2, "br");
    \u0275\u0275elementStart(3, "div", 4)(4, "button", 5);
    \u0275\u0275listener("click", function AuthPageComponent_Conditional_3_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goBack());
    });
    \u0275\u0275text(5, "Regresar");
    \u0275\u0275elementEnd()();
  }
}
function AuthPageComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-footer", 2);
  }
}
var AuthPageComponent = class _AuthPageComponent {
  isLogin = true;
  todayDate = /* @__PURE__ */ new Date();
  router = inject(Router);
  goBack() {
    this.router.navigate([ROUTE_PATHS.LOGIN]);
  }
  static \u0275fac = function AuthPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthPageComponent, selectors: [["app-auth-page"]], inputs: { isLogin: "isLogin" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 2, consts: [[1, "auth-page"], [1, "container-grid-list"], [1, "custom-app-footer"], ["src", "/assets/images/404.png", "alt", "404_found", 1, "container__img"], [1, "button__container"], ["mat-raised-button", "", "color", "raised", 1, "button__not_found", 3, "click"]], template: function AuthPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275template(2, AuthPageComponent_Conditional_2_Template, 1, 0, "app-login")(3, AuthPageComponent_Conditional_3_Template, 6, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(4, AuthPageComponent_Conditional_4_Template, 1, 0, "app-footer", 2);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isLogin === true ? 2 : 3);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.isLogin ? 4 : -1);
    }
  }, dependencies: [
    LoginComponent,
    FooterComponent,
    MatButtonModule,
    MatButton,
    RouterModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthPageComponent, { className: "AuthPageComponent", filePath: "src\\app\\auth\\layout\\auth-page\\auth-page.component.ts", lineNumber: 23 });
})();

// src/app/auth/auth.routes.ts
var AUTH_ROUTES = [{ path: "", component: AuthPageComponent }];
export {
  AUTH_ROUTES
};
//# sourceMappingURL=chunk-FNYBIFN2.js.map
