import {
  routes
} from "./chunk-QPMGCNUX.js";
import {
  DomRendererFactory2,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter
} from "./chunk-FBN4GXPF.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionScheduler,
  DOCUMENT,
  Injectable,
  InjectionToken,
  NgZone,
  RendererFactory2,
  RuntimeError,
  inject,
  makeEnvironmentProviders,
  performanceMarkFeature,
  provideZoneChangeDetection,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵinvalidFactory
} from "./chunk-7SPA2HJF.js";

// node_modules/@angular/platform-browser/fesm2022/animations/async.mjs
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class _AsyncAnimationRendererFactory {
  /**
   *
   * @param moduleImpl allows to provide a mock implmentation (or will load the animation module)
   */
  constructor(doc, delegate, zone, animationType, moduleImpl) {
    this.doc = doc;
    this.delegate = delegate;
    this.zone = zone;
    this.animationType = animationType;
    this.moduleImpl = moduleImpl;
    this._rendererFactoryPromise = null;
    this.scheduler = inject(ChangeDetectionScheduler, {
      optional: true
    });
    this.loadingSchedulerFn = inject(\u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN, {
      optional: true
    });
  }
  /** @nodoc */
  ngOnDestroy() {
    this._engine?.flush();
  }
  /**
   * @internal
   */
  loadImpl() {
    const loadFn = () => this.moduleImpl ?? import("./chunk-MWX4HUK5.js").then((m) => m);
    let moduleImplPromise;
    if (this.loadingSchedulerFn) {
      moduleImplPromise = this.loadingSchedulerFn(loadFn);
    } else {
      moduleImplPromise = loadFn();
    }
    return moduleImplPromise.catch((e) => {
      throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
    }).then(({
      \u0275createEngine,
      \u0275AnimationRendererFactory
    }) => {
      this._engine = \u0275createEngine(this.animationType, this.doc);
      const rendererFactory = new \u0275AnimationRendererFactory(this.delegate, this._engine, this.zone);
      this.delegate = rendererFactory;
      return rendererFactory;
    });
  }
  /**
   * This method is delegating the renderer creation to the factories.
   * It uses default factory while the animation factory isn't loaded
   * and will rely on the animation factory once it is loaded.
   *
   * Calling this method will trigger as side effect the loading of the animation module
   * if the renderered component uses animations.
   */
  createRenderer(hostElement, rendererType) {
    const renderer = this.delegate.createRenderer(hostElement, rendererType);
    if (renderer.\u0275type === 0) {
      return renderer;
    }
    if (typeof renderer.throwOnSyntheticProps === "boolean") {
      renderer.throwOnSyntheticProps = false;
    }
    const dynamicRenderer = new DynamicDelegationRenderer(renderer);
    if (rendererType?.data?.["animation"] && !this._rendererFactoryPromise) {
      this._rendererFactoryPromise = this.loadImpl();
    }
    this._rendererFactoryPromise?.then((animationRendererFactory) => {
      const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
      dynamicRenderer.use(animationRenderer);
      this.scheduler?.notify(
        10
        /* NotificationSource.AsyncAnimationsLoaded */
      );
    }).catch((e) => {
      dynamicRenderer.use(renderer);
    });
    return dynamicRenderer;
  }
  begin() {
    this.delegate.begin?.();
  }
  end() {
    this.delegate.end?.();
  }
  whenRenderingDone() {
    return this.delegate.whenRenderingDone?.() ?? Promise.resolve();
  }
  static {
    this.\u0275fac = function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
      \u0275\u0275invalidFactory();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _AsyncAnimationRendererFactory,
      factory: _AsyncAnimationRendererFactory.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{
    type: Injectable
  }], () => [{
    type: Document
  }, {
    type: RendererFactory2
  }, {
    type: NgZone
  }, {
    type: void 0
  }, {
    type: Promise
  }], null);
})();
var DynamicDelegationRenderer = class {
  constructor(delegate) {
    this.delegate = delegate;
    this.replay = [];
    this.\u0275type = 1;
  }
  use(impl) {
    this.delegate = impl;
    if (this.replay !== null) {
      for (const fn of this.replay) {
        fn(impl);
      }
      this.replay = null;
    }
  }
  get data() {
    return this.delegate.data;
  }
  destroy() {
    this.replay = null;
    this.delegate.destroy();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  get destroyNode() {
    return this.delegate.destroyNode;
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
  }
  insertBefore(parent, newChild, refChild, isMove) {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }
  removeChild(parent, oldChild, isHostElement) {
    this.delegate.removeChild(parent, oldChild, isHostElement);
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style, value, flags) {
    this.delegate.setStyle(el, style, value, flags);
  }
  removeStyle(el, style, flags) {
    this.delegate.removeStyle(el, style, flags);
  }
  setProperty(el, name, value) {
    if (this.shouldReplay(name)) {
      this.replay.push((renderer) => renderer.setProperty(el, name, value));
    }
    this.delegate.setProperty(el, name, value);
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback) {
    if (this.shouldReplay(eventName)) {
      this.replay.push((renderer) => renderer.listen(target, eventName, callback));
    }
    return this.delegate.listen(target, eventName, callback);
  }
  shouldReplay(propOrEventName) {
    return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
  }
};
var \u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
  performanceMarkFeature("NgAsyncAnimations");
  return makeEnvironmentProviders([{
    provide: RendererFactory2,
    useFactory: (doc, renderer, zone) => {
      return new AsyncAnimationRendererFactory(doc, renderer, zone, type);
    },
    deps: [DOCUMENT, DomRendererFactory2, NgZone]
  }, {
    provide: ANIMATION_MODULE_TYPE,
    useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
  }]);
}

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideAnimationsAsync()
  ]
};

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  title = "responsive-angular18";
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n.dark[_ngcontent-%COMP%]   .dark\\:divide-gray-700[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not([hidden])    ~ [_ngcontent-%COMP%]:not([hidden]) {\n  border-color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-50[_ngcontent-%COMP%] {\n  background-color: rgba(249, 250, 251);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-100[_ngcontent-%COMP%] {\n  background-color: rgba(243, 244, 246);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-600[_ngcontent-%COMP%] {\n  background-color: rgba(75, 85, 99);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-700[_ngcontent-%COMP%] {\n  background-color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-800[_ngcontent-%COMP%] {\n  background-color: rgba(31, 41, 55);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-gray-900[_ngcontent-%COMP%] {\n  background-color: rgba(17, 24, 39);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-red-700[_ngcontent-%COMP%] {\n  background-color: rgba(185, 28, 28);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:bg-green-700[_ngcontent-%COMP%] {\n  background-color: rgba(4, 120, 87);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:bg-gray-200[_ngcontent-%COMP%]:hover {\n  background-color: rgba(229, 231, 235);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:bg-gray-600[_ngcontent-%COMP%]:hover {\n  background-color: rgba(75, 85, 99);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:bg-gray-700[_ngcontent-%COMP%]:hover {\n  background-color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:bg-gray-900[_ngcontent-%COMP%]:hover {\n  background-color: rgba(17, 24, 39);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-100[_ngcontent-%COMP%] {\n  border-color: rgba(243, 244, 246);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-400[_ngcontent-%COMP%] {\n  border-color: rgba(156, 163, 175);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-500[_ngcontent-%COMP%] {\n  border-color: rgba(107, 114, 128);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-600[_ngcontent-%COMP%] {\n  border-color: rgba(75, 85, 99);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-700[_ngcontent-%COMP%] {\n  border-color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:border-gray-900[_ngcontent-%COMP%] {\n  border-color: rgba(17, 24, 39);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:border-gray-800[_ngcontent-%COMP%]:hover {\n  border-color: rgba(31, 41, 55);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-white[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-50[_ngcontent-%COMP%] {\n  color: rgba(249, 250, 251);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-100[_ngcontent-%COMP%] {\n  color: rgba(243, 244, 246);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-200[_ngcontent-%COMP%] {\n  color: rgba(229, 231, 235);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-400[_ngcontent-%COMP%] {\n  color: rgba(156, 163, 175);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-500[_ngcontent-%COMP%] {\n  color: rgba(107, 114, 128);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-700[_ngcontent-%COMP%] {\n  color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-gray-800[_ngcontent-%COMP%] {\n  color: rgba(31, 41, 55);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-red-100[_ngcontent-%COMP%] {\n  color: rgba(254, 226, 226);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-green-100[_ngcontent-%COMP%] {\n  color: rgba(209, 250, 229);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:text-blue-400[_ngcontent-%COMP%] {\n  color: rgba(96, 165, 250);\n}\n.dark[_ngcontent-%COMP%]   .group[_ngcontent-%COMP%]:hover   .dark\\:group-hover\\:text-gray-500[_ngcontent-%COMP%] {\n  color: rgba(107, 114, 128);\n}\n.dark[_ngcontent-%COMP%]   .group[_ngcontent-%COMP%]:focus   .dark\\:group-focus\\:text-gray-700[_ngcontent-%COMP%] {\n  color: rgba(55, 65, 81);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:text-gray-100[_ngcontent-%COMP%]:hover {\n  color: rgba(243, 244, 246);\n}\n.dark[_ngcontent-%COMP%]   .dark\\:hover\\:text-blue-500[_ngcontent-%COMP%]:hover {\n  color: rgba(59, 130, 246);\n}\n.header-right[_ngcontent-%COMP%] {\n  width: calc(100% - 3.5rem);\n}\n.sidebar[_ngcontent-%COMP%]:hover {\n  width: 16rem;\n}\n@media only screen and (min-width: 768px) {\n  .header-right[_ngcontent-%COMP%] {\n    width: calc(100% - 16rem);\n  }\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src\\app\\app.component.ts", lineNumber: 11 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations/async.mjs:
  (**
   * @license Angular v18.2.13
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
