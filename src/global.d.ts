declare module "redux-mock-store" {
  import { Middleware } from "redux";
  function configureMockStore<T = any>(middlewares?: Middleware[]): any;
  export default configureMockStore;
}
