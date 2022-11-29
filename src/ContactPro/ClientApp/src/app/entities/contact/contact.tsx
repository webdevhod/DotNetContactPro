import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { openFile, byteSize, Translate, TextFormat } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from "app/config/constants";
import { useAppDispatch, useAppSelector } from "app/config/store";

import { IContact } from "app/shared/model/contact.model";
import { getEntities } from "./contact.reducer";

export const Contact = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const contactList = useAppSelector((state) => state.contact.entities);
  const loading = useAppSelector((state) => state.contact.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  const { match } = props;

  return (
    <div>
      <h2 id="contact-heading" data-cy="ContactHeading">
        Contacts
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            color="info"
            onClick={handleSyncList}
            disabled={loading}
          >
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh List
          </Button>
          <Link
            to="/contact/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Contact
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {contactList && contactList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address 1</th>
                <th>Address 2</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Birth Date</th>
                <th>Image Data</th>
                <th>Image Type</th>
                <th>Created</th>
                <th>User</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {contactList.map((contact, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button
                      tag={Link}
                      to={`/contact/${contact.id}`}
                      color="link"
                      size="sm"
                    >
                      {contact.id}
                    </Button>
                  </td>
                  <td>{contact.firstName}</td>
                  <td>{contact.lastName}</td>
                  <td>{contact.address1}</td>
                  <td>{contact.address2}</td>
                  <td>{contact.city}</td>
                  <td>{contact.state}</td>
                  <td>{contact.zipCode}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phoneNumber}</td>
                  <td>
                    {contact.birthDate ? (
                      <TextFormat
                        type="date"
                        value={contact.birthDate}
                        format={APP_LOCAL_DATE_FORMAT}
                      />
                    ) : null}
                  </td>
                  <td>
                    {contact.imageData ? (
                      <div>
                        {contact.imageDataContentType ? (
                          <a
                            onClick={openFile(
                              contact.imageDataContentType,
                              contact.imageData
                            )}
                          >
                            <img
                              src={`data:${contact.imageDataContentType};base64,${contact.imageData}`}
                              style={{ maxHeight: "30px" }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {contact.imageDataContentType},{" "}
                          {byteSize(contact.imageData)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{contact.imageType}</td>
                  <td>
                    {contact.created ? (
                      <TextFormat
                        type="date"
                        value={contact.created}
                        format={APP_LOCAL_DATE_FORMAT}
                      />
                    ) : null}
                  </td>
                  <td>{contact.user ? contact.user.login : ""}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/contact/${contact.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{" "}
                        <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/contact/${contact.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{" "}
                        <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/contact/${contact.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{" "}
                        <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">No Contacts found</div>
          )
        )}
      </div>
    </div>
  );
};

export default Contact;
