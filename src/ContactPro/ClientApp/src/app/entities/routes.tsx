import React from "react";
import { Switch } from "react-router-dom";
import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";

import Contact from "./contact";
import Category from "./category";
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
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </Switch>
    </div>
  );
};
