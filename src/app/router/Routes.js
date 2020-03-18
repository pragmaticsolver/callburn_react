/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import HomePage from "../pages/home/HomePage";
import { LayoutContextProvider } from "../../_metronic";
import * as routerHelpers from "../router/RouterHelpers";

export const Routes = withRouter(({ Layout, history }) => {
  const lastLocation = useLastLocation();
  routerHelpers.saveLastLocation(lastLocation);
  const { isAuthorized, menuConfig, userLastLocation } = useSelector(
    ({ auth, urls, builder: { menuConfig } }) => ({
      menuConfig,
      isAuthorized: auth.user != null,
      userLastLocation: routerHelpers.getLastLocation()
    }),
    shallowEqual
  );

  return (
    /* Create `LayoutContext` from current `history` and `menuConfig`. */
    <LayoutContextProvider history={history} menuConfig={menuConfig}>
     
          <Layout>
            <HomePage userLastLocation={userLastLocation} />
          </Layout>
      
    </LayoutContextProvider>
  );
});
