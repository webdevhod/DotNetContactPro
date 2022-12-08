import React from "react";
import { Switch } from "react-router-dom";

import ErrorBoundaryRoute from "app/shared/error/error-boundary-route";

import Category from "./category";
import CategoryDetail from "./category-detail";
import CategoryUpdate from "./category-update";
import CategoryDeleteDialog from "./category-delete-dialog";
import EmailPage from "../email-data/email-page";

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute
        exact
        path={`${match.url}/new`}
        component={CategoryUpdate}
      />
      <ErrorBoundaryRoute
        exact
        path={`${match.url}/:id/edit`}
        component={CategoryUpdate}
      />
      <ErrorBoundaryRoute
        exact
        path={`${match.url}/:id`}
        component={CategoryDetail}
      />
      <ErrorBoundaryRoute
        exact
        path={`${match.url}/:id/email`}
        component={EmailPage}
      />
      <ErrorBoundaryRoute path={match.url} component={Category} />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${match.url}/:id/delete`}
      component={CategoryDeleteDialog}
    />
  </>
);

export default Routes;
