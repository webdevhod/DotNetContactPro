import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { IContact } from "app/shared/model/contact.model";
import { getEntities } from "./contact.reducer";
import { ICategory } from 'app/shared/model/category.model';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';

export const Contact = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const contactList = useAppSelector((state) => state.contact.entities);
  const loading = useAppSelector((state) => state.contact.loading);

  const categories = useAppSelector(state => state.category.entities);
  const [categoryId, setCategoryId] = useState('0');
  const [searchTerm, setSearchTerm] = useState("");

  const { match } = props;

  useEffect(() => {
    dispatch(getEntities({}));
    dispatch(getCategories({}));
  }, []);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        categoryId,
        searchTerm
      })
    );
  };

  useEffect(() => {
    getAllEntities();
  }, [categoryId]);

  return (
    <>
      <div className="row">
        <div className="col-12 text-end mb-3">
          <Link to="/contact/new" className="btn btn-primary rounded-pill" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create New
          </Link>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-4 sideNav px-3 py-4">
          <form>
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                name="searchString"
                placeholder="Search Term"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                }}
              />
              <input
                type="submit"
                className="btn btn-outline-primary"
                value="Search"
                onClick={e => {
                  e.preventDefault();
                  getAllEntities();
                }}
              />
            </div>
          </form>
          <form>
            <div className="contact-mt">
              <label className="form-label fw-bold">CATEGORY FILTER</label>
              <select
                name="categoryId"
                className="form-control"
                value={categoryId}
                onChange={e => {
                  setSearchTerm('');
                  setCategoryId(e.target.value);
                }}
              >
                <option value="0">All Contacts</option>
                {categories.map((c: ICategory) => {
                  return c.contacts != null && c.contacts.length > 0 ? (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </form>
        </div>
        <div className="col-12 col-md-8">
          <div className="row row-cols-1 g-3">
            {contactList != null && contactList.length > 0
              ? [...contactList]
                  .sort(function (a: IContact, b: IContact) {
                    if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1;
                    else if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return 1;
                    else {
                      if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
                      else if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
                    }
                    return 0;
                  })
                  .map((contact: IContact, i: number) => (
                    <div key={i} className="col">
                      <div className="card mb-3">
                        <div className="row g-0">
                          <div className="col-md-4 square-img-container">
                            <img
                              src={
                                contact.imageType && contact.imageData
                                  ? `data:${contact.imageType};base64,${contact.imageData}`
                                  : '/content/img/DefaultContactImage.png'
                              }
                              className="square-img rounded-start"
                              alt={`${contact.firstName} ${contact.lastName}`}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body">
                              <h5 className="card-title">{`${contact.firstName} ${contact.lastName}`}</h5>
                              <div className="card-text">
                                {contact.address1}
                                <br />
                                {contact.address2 ? contact.address2 : null}
                                {contact.address2 ? <br /> : null}
                                {contact.city}, {contact.state} {contact.zipCode}
                              </div>
                              <div className="card-text">
                                <span className="fw-bold me-2">Phone:</span>
                                {contact.phoneNumber}
                              </div>
                              <div className="card-text">
                                <span className="fw-bold me-2">Email:</span>
                                {contact.email}
                              </div>
                              <div className="fs-4 d-flex gap-1 contact-mt">
                                <Link className="me-3 editIcons" to={`${match.url}/${contact.id}/edit`}>
                                  <i className="bi bi-pencil-fill "></i>
                                </Link>
                                <Link className="me-3 editIcons" to={`/email-contact/${contact.id}`}>
                                  <i className="bi bi-envelope-fill "></i>
                                </Link>
                                <Link className="me-3 editIcons" to={`${match.url}/${contact.id}/delete`}>
                                  <i className="bi bi-trash-fill text-danger "></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              : !loading && <h4 className="ps-3 pt-2 text-body">No contacts found</h4>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
