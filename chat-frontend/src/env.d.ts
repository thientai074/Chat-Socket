// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_CLIENT_URL: string;
  readonly VITE_SOCKET_URL: string;
  // more env variables...
  readonly VITE_NAME_COOKIE: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_NAME_ID: string;
  readonly VITE_PARAM_ID: string;
  readonly VITE_ENCRYPT_OBJECT: string;
  readonly VITE_DOMAIN_AFF: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }
