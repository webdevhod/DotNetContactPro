import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Row, Col, FormText } from "reactstrap";
import { isNumber, ValidatedField, ValidatedForm } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  convertDateTimeFromServer,
  convertDateTimeToServer,
  displayDefaultDateTime,
} from "app/shared/util/date-utils";
import { mapIdList } from "app/shared/util/entity-utils";
import { useAppDispatch, useAppSelector } from "app/config/store";

import { IUser } from "app/shared/model/user.model";
import { getUsers } from "app/modules/administration/user-management/user-management.reducer";
import { IContact } from "app/shared/model/contact.model";
import { getEntities as getContacts } from "app/entities/contact/contact.reducer";
import { ICategory } from "app/shared/model/category.model";
import {
  getEntity,
  updateEntity,
  createEntity,
  reset,
} from "./category.reducer";

export const CategoryUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const users = useAppSelector((state) => state.userManagement.users);
  const contacts = useAppSelector((state) => state.contact.entities);
  const categoryEntity = useAppSelector((state) => state.category.entity);
  const loading = useAppSelector((state) => state.category.loading);
  const updating = useAppSelector((state) => state.category.updating);
  const updateSuccess = useAppSelector((state) => state.category.updateSuccess);
  const handleClose = () => {
    props.history.push("/category");
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getUsers({}));
    dispatch(getContacts({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = (values) => {
    const entity = {
      ...categoryEntity,
      ...values,
      contacts: mapIdList(values.contacts),
      user: users.find((it) => it.id.toString() === values.user.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...categoryEntity,
          user: categoryEntity?.user?.id,
          contacts: categoryEntity?.contacts?.map((e) => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="contactProApp.category.home.createOrEditLabel"
            data-cy="CategoryCreateUpdateHeading"
          >
            Create or edit a Category
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm
              defaultValues={defaultValues()}
              onSubmit={saveEntity}
            >
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="category-id"
                  label="ID"
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label="Name"
                id="category-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                id="category-user"
                name="user"
                data-cy="user"
                label="User"
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label="Contact"
                id="category-contact"
                data-cy="contact"
                type="select"
                multiple
                name="contacts"
              >
                <option value="" key="0" />
                {contacts
                  ? contacts.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/category"
                replace
                color="info"
              >
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button
                color="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                type="submit"
                disabled={updating}
              >
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CategoryUpdate;
