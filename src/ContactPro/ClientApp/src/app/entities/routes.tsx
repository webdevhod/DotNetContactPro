import React from "react";
import { Switch } from "react-router-dom";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";

import Contact from "./contact";
import Category from "./category";
import PageNotFound from "../shared/error/page-not-found";
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default ({ match }) => {
  return (
    <div>
      <Switch>
        {/* prettier-ignore */}
        <ErrorBoundaryRoute path={`${match.url}contact`} component={Contact} />
        <ErrorBoundaryRoute
          path={`${match.url}category`}
          component={Category}
        />
        <ErrorBoundaryRoute path={`${match.url}404`} component={PageNotFound} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </Switch>
    </div>
  );
};
