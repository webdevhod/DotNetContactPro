import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Row, Col, FormText } from "reactstrap";
import {
  isNumber,
  ValidatedField,
  ValidatedForm,
  ValidatedBlobField,
} from "react-jhipster";
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
import { ICategory } from "app/shared/model/category.model";
import { getEntities as getCategories } from "app/entities/category/category.reducer";
import { IContact } from "app/shared/model/contact.model";
import { States } from "app/shared/model/enumerations/states.model";
import {
  getEntity,
  updateEntity,
  createEntity,
  reset,
} from "./contact.reducer";

export const ContactUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const users = useAppSelector((state) => state.userManagement.users);
  const categories = useAppSelector((state) => state.category.entities);
  const contactEntity = useAppSelector((state) => state.contact.entity);
  const loading = useAppSelector((state) => state.contact.loading);
  const updating = useAppSelector((state) => state.contact.updating);
  const updateSuccess = useAppSelector((state) => state.contact.updateSuccess);
  const statesValues = Object.keys(States);
  const handleClose = () => {
    props.history.push("/contact");
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getUsers({}));
    dispatch(getCategories({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = (values) => {
    const entity = {
      ...contactEntity,
      ...values,
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
          state: "AK",
          ...contactEntity,
          user: contactEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="contactProApp.contact.home.createOrEditLabel"
            data-cy="ContactCreateUpdateHeading"
          >
            Create or edit a Contact
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
                  id="contact-id"
                  label="ID"
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label="First Name"
                id="contact-firstName"
                name="firstName"
                data-cy="firstName"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Last Name"
                id="contact-lastName"
                name="lastName"
                data-cy="lastName"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Address 1"
                id="contact-address1"
                name="address1"
                data-cy="address1"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Address 2"
                id="contact-address2"
                name="address2"
                data-cy="address2"
                type="text"
              />
              <ValidatedField
                label="City"
                id="contact-city"
                name="city"
                data-cy="city"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="State"
                id="contact-state"
                name="state"
                data-cy="state"
                type="select"
              >
                {statesValues.map((states) => (
                  <option value={states} key={states}>
                    {states}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label="Zip Code"
                id="contact-zipCode"
                name="zipCode"
                data-cy="zipCode"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Email"
                id="contact-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Phone Number"
                id="contact-phoneNumber"
                name="phoneNumber"
                data-cy="phoneNumber"
                type="text"
                validate={{
                  required: { value: true, message: "This field is required." },
                }}
              />
              <ValidatedField
                label="Birth Date"
                id="contact-birthDate"
                name="birthDate"
                data-cy="birthDate"
                type="date"
              />
              <ValidatedBlobField
                label="Image Data"
                id="contact-imageData"
                name="imageData"
                data-cy="imageData"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label="Image Type"
                id="contact-imageType"
                name="imageType"
                data-cy="imageType"
                type="text"
              />
              <ValidatedField
                label="Created"
                id="contact-created"
                name="created"
                data-cy="created"
                type="date"
              />
              <ValidatedField
                id="contact-user"
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
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/contact"
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

export default ContactUpdate;
