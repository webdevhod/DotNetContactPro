import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import Loadable from "react-loadable";

import Login from "app/modules/login/login";
import Register from "app/modules/account/register/register";
import Activate from "app/modules/account/activate/activate";
import PasswordResetInit from "app/modules/account/password-reset/init/password-reset-init";
import PasswordResetFinish from "app/modules/account/password-reset/finish/password-reset-finish";
import Logout from "app/modules/login/logout";
import Home from "app/modules/home/home";
import EntitiesRoutes from "app/entities/routes";
import PrivateRoute from "app/shared/auth/private-route";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";
import PageNotFound from "app/shared/error/page-not-found";
import { AUTHORITIES } from "app/config/constants";

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ "app/modules/account"),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "administration" */ "app/modules/administration"
    ),
  loading: () => loading,
});

const Routes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section className={`${pathname === '/' ? 'container-fluid' : 'container'} h-100`} id="app-view-container">
      <Switch>
        <ErrorBoundaryRoute path="/login" component={Login} />
        <ErrorBoundaryRoute path="/logout" component={Logout} />
        <ErrorBoundaryRoute path="/account/register" component={Register} />
        <ErrorBoundaryRoute
          path="/account/activate/:key?"
          component={Activate}
        />
        <ErrorBoundaryRoute
          path="/account/reset/request"
          component={PasswordResetInit}
        />
        <ErrorBoundaryRoute
          path="/account/reset/finish/:key?"
          component={PasswordResetFinish}
        />
        <PrivateRoute
          path="/admin"
          component={Admin}
          hasAnyAuthorities={[AUTHORITIES.ADMIN]}
        />
        <PrivateRoute
          path="/account"
          component={Account}
          hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.GUEST]}
        />
        <ErrorBoundaryRoute path="/" exact component={Home} />
        <PrivateRoute
          path="/"
          component={EntitiesRoutes}
          hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.GUEST]}
        />
        <ErrorBoundaryRoute component={PageNotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
