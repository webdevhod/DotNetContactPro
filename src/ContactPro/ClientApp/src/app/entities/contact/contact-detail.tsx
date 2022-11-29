import React, { useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Row, Col } from "reactstrap";
import { openFile, byteSize, TextFormat } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from "app/config/constants";
import { useAppDispatch, useAppSelector } from "app/config/store";

import { getEntity } from "./contact.reducer";

export const ContactDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const contactEntity = useAppSelector((state) => state.contact.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="contactDetailsHeading">Contact</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{contactEntity.id}</dd>
          <dt>
            <span id="firstName">First Name</span>
          </dt>
          <dd>{contactEntity.firstName}</dd>
          <dt>
            <span id="lastName">Last Name</span>
          </dt>
          <dd>{contactEntity.lastName}</dd>
          <dt>
            <span id="address1">Address 1</span>
          </dt>
          <dd>{contactEntity.address1}</dd>
          <dt>
            <span id="address2">Address 2</span>
          </dt>
          <dd>{contactEntity.address2}</dd>
          <dt>
            <span id="city">City</span>
          </dt>
          <dd>{contactEntity.city}</dd>
          <dt>
            <span id="state">State</span>
          </dt>
          <dd>{contactEntity.state}</dd>
          <dt>
            <span id="zipCode">Zip Code</span>
          </dt>
          <dd>{contactEntity.zipCode}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{contactEntity.email}</dd>
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{contactEntity.phoneNumber}</dd>
          <dt>
            <span id="birthDate">Birth Date</span>
          </dt>
          <dd>
            {contactEntity.birthDate ? (
              <TextFormat
                value={contactEntity.birthDate}
                type="date"
                format={APP_LOCAL_DATE_FORMAT}
              />
            ) : null}
          </dd>
          <dt>
            <span id="imageData">Image Data</span>
          </dt>
          <dd>
            {contactEntity.imageData ? (
              <div>
                {contactEntity.imageDataContentType ? (
                  <a
                    onClick={openFile(
                      contactEntity.imageDataContentType,
                      contactEntity.imageData
                    )}
                  >
                    <img
                      src={`data:${contactEntity.imageDataContentType};base64,${contactEntity.imageData}`}
                      style={{ maxHeight: "30px" }}
                    />
                  </a>
                ) : null}
                <span>
                  {contactEntity.imageDataContentType},{" "}
                  {byteSize(contactEntity.imageData)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="imageType">Image Type</span>
          </dt>
          <dd>{contactEntity.imageType}</dd>
          <dt>
            <span id="created">Created</span>
          </dt>
          <dd>
            {contactEntity.created ? (
              <TextFormat
                value={contactEntity.created}
                type="date"
                format={APP_LOCAL_DATE_FORMAT}
              />
            ) : null}
          </dd>
          <dt>User</dt>
          <dd>{contactEntity.user ? contactEntity.user.login : ""}</dd>
        </dl>
        <Button
          tag={Link}
          to="/contact"
          replace
          color="info"
          data-cy="entityDetailsBackButton"
        >
          <FontAwesomeIcon icon="arrow-left" />{" "}
          <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button
          tag={Link}
          to={`/contact/${contactEntity.id}/edit`}
          replace
          color="primary"
        >
          <FontAwesomeIcon icon="pencil-alt" />{" "}
          <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default ContactDetail;
