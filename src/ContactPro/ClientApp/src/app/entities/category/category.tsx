import React, { useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { APP_DATE_FORMAT } from "app/config/constants";
import { useAppDispatch, useAppSelector } from "app/config/store";

import { getEntities, reset } from "./category.reducer";

export const Category = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const categoryList = useAppSelector((state) => state.category.entities);
  const loading = useAppSelector((state) => state.category.loading);
  const categoryErrorMessage = useAppSelector(state => state.category.errorMessage);

  useEffect(() => {
    handleSyncList();
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  useEffect(() => {
    dispatch(reset());
    handleSyncList();
  }, [categoryErrorMessage]);

  return (
    <div>
      <h2 id="category-heading" data-cy="CategoryHeading">
        Categories
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            color="info"
            onClick={handleSyncList}
            disabled={loading}
          >
            <FontAwesomeIcon icon="sync" spin={loading} />&nbsp; Refresh List
          </Button>
          <Link
            to="/category/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Category
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {categoryList && categoryList.length > 0 ? (
            <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th className="hand col-7 align-middle">
                  Name <FontAwesomeIcon icon="sort" className="ms-2" />
                </th>
                <th className="hand align-middle">
                  Created <FontAwesomeIcon icon="sort" className="ms-2" />
                </th>
                <th className="align-middle">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((category, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td className="align-middle">
                    <Link to={`/category/${category.id}`} style={{ fontWeight: 'normal', textDecoration: 'none' }}>
                      {category.name}
                    </Link>
                  </td>
                  <td className="align-middle">
                    {category.created ? <TextFormat type="date" value={category.created} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td className="text-end align-middle">
                    <div className="btn-group flex-btn-group-container gap-2">
                      <Button tag={Link} to={`/category/${category.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/email-category/${category.id}`} color="info" size="sm" data-cy="entityEmailButton">
                        <FontAwesomeIcon icon={faEnvelope} /> <span className="d-none d-md-inline">Email</span>
                      </Button>
                      <Button tag={Link} to={`/category/${category.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">No Categories found</div>
          )
        )}
      </div>
    </div>
  );
};

export default Category;
