/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
/// <reference types="node/url"/>

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>;
  export default component;
}
