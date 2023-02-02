import Vue from "vue";
import Router from "vue-router";

import {
  initCurrentUserStateMiddleware,
  checkAccessMiddleware,
  setPageTitleMiddleware
} from "./middlewares";
import { routes } from "./routes";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes, // short for router: router
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkExactActiveClass: "nav-item active"
});

router.beforeEach(initCurrentUserStateMiddleware);
router.beforeEach(checkAccessMiddleware);
router.beforeEach(setPageTitleMiddleware);

export default router;
