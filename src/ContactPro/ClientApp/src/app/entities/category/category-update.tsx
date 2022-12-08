import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Row, Col, Label } from "reactstrap";
import { ValidatedField, ValidatedForm } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from "app/config/store";

import { getUsers } from "app/modules/administration/user-management/user-management.reducer";
import { getEntities as getContacts } from "app/entities/contact/contact.reducer";
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
  const [contactsSelected, setContactsSelected] = useState([]);
  const errorMessage = useAppSelector(state => state.category.errorMessage);

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
    if (categoryEntity != null && categoryEntity.contacts != null) {
      setContactsSelected([...categoryEntity.contacts]);
    }
  }, [categoryEntity]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (errorMessage != null) {
      dispatch(reset());
      props.history.push("/404");
    }
  }, [errorMessage]);

  const saveEntity = (values) => {
    const entity = {
      ...categoryEntity,
      ...values,
      contacts: contactsSelected,
      user: users.find((it) => it.id?.toString() === values.user?.toString()),
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
            {`${isNew ? 'Create' : 'Edit'} Category`}
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
                  hidden
                  id="category-id"
                  label="ID"
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label="Category Name"
                id="category-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <Label htmlFor="contacts">Contacts</Label>
              <Select
                className="col-12 col-lg-6 mb-3"
                id="category-contact"
                data-cy="contact"
                name="contacts"
                isMulti={true}
                isSearchable={true}
                getOptionValue={option => option.id}
                getOptionLabel={option => `${option.firstName} ${option.lastName} <${option.email}>`}
                options={contacts}
                isClearable={true}
                closeMenuOnSelect={false}
                openMenuOnFocus={true}
                value={contactsSelected}
                backspaceRemovesValue={true}
                onChange={e => {
                  setContactsSelected([...e]);
                }}
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/category" replace color="secondary">
                <FontAwesomeIcon icon="arrow-left" />
                <span className="d-inline">&nbsp;Back</span>
              </Button>
              {isNew ? null : 
                <>
                  &nbsp;
                  <Button tag={Link} to={`/category/${props.match.params.id}/email`} data-cy="entityCreateEmailButton" replace className="ms-1" color="info">
                    <FontAwesomeIcon icon={faEnvelope} />
                  <span className="d-inline">&nbsp;Email</span>
                  </Button>
                </>
              }
              &nbsp;
              <Button id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating} className="ms-1" color="primary">
                <FontAwesomeIcon icon="save" />
                <span className="d-inline">&nbsp;Save</span>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CategoryUpdate;
