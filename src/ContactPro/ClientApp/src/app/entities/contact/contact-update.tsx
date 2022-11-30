import { decode } from 'base64-arraybuffer';
import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Select from 'react-select';
import { Button, Label } from "reactstrap";
import {
  ValidatedField,
  ValidatedForm,
  ValidatedBlobField,
} from "react-jhipster";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { ICategory } from "app/shared/model/category.model";
import { getEntities as getCategories } from "app/entities/category/category.reducer";
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

  const defaultValues = () => isNew ? {} : { state: "CA", ...contactEntity };
  const errorMessage = useAppSelector(state => state.contact.errorMessage);

  const categories = useAppSelector((state) => state.category.entities);
  const contactEntity = useAppSelector((state) => state.contact.entity);
  const loading = useAppSelector((state) => state.contact.loading);
  const updating = useAppSelector((state) => state.contact.updating);
  const updateSuccess = useAppSelector((state) => state.contact.updateSuccess);
  const statesValues = Object.keys(States);

  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imageData, setImageData] = useState([]);
  const [imageType, setImageType] = useState('');

  const handleClose = () => {
    props.history.push("/contact");
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getCategories({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(reset());
      handleClose();
    }
  }, [updateSuccess]);


  const reader = new FileReader();
  reader.addEventListener('load', () => {
      const dataUrl = reader.result as string;
      const phrase = ';base64,';
      const index = dataUrl.indexOf(phrase) + phrase.length;
      const imageString = dataUrl.substring(index);
      setImageBase64(imageString);
      const array = new Uint8Array(decode(imageString));
      setImageData(Array.from(array));
    }, false
  );

  useEffect(() => {
    if (imageFile) {
      setImageType(imageFile.type);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    setFirstName(contactEntity.firstName || '');
    setLastName(contactEntity.lastName || '');
    setEmail(contactEntity.email || '');
    setPhoneNumber(contactEntity.phoneNumber || '');
    setAddress1(contactEntity.address1 || '');
    setAddress2(contactEntity.address2 || '');
    setCity(contactEntity.city || '');
    setState(contactEntity.state || '');
    setZipCode(contactEntity.zipCode || '');
    setBirthDate(contactEntity.birthDate || '');
    setImageData(contactEntity.imageData || []);
    setImageBase64(contactEntity.imageData || '');
    setImageType(contactEntity.imageType || '');
    setCategoriesSelected(
      contactEntity.categories != null ? contactEntity.categories.map((c: ICategory) => ({ id: c.id, name: c.name })) : []
    );
  }, [contactEntity]);

  useEffect(() => {
    if (errorMessage != null) {
      dispatch(reset());
      props.history.push("/404");
    }
  }, [errorMessage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, callBack): void => {
    callBack(event.target.value);
  };

  const saveEntity = () => {
    const entity = {
      ...contactEntity,
      firstName,
      lastName,
      email,
      phoneNumber,
      address1,
      address2,
      city,
      state,
      zipCode,
      birthDate,
      imageData,
      imageType,
      categories: categoriesSelected,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  return (
    <>
      <h1>EDIT CONTACT</h1>
      <div className="p-3 border border-2 shadow-lg bg-light">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
            <div className="row g-3 p-2">
              <div className="col-12 col-lg-4">
                <div className="square-img-container">
                  <img
                    className="square-img"
                    id="contact-imagePreview"
                    src={
                      imageType && imageBase64
                        ? `data:${imageType};base64,${imageBase64}`
                        : '/content/img/DefaultContactImage.png'
                    }
                  />
                </div>
                <ValidatedBlobField
                  className="mt-2"
                  id="contact-image"
                  name="image"
                  data-cy="image"
                  isImage
                  accept="image/*"
                  onChange={event => {
                    setImageFile(event.target.files[0]);
                  }}
                />
              </div>
              <div className="col-12 col-lg-8">
                <div className="row">
                  {!isNew ? (
                    <ValidatedField name="id" required readOnly hidden id="contact-id" label="ID" validate={{ required: true }} />
                  ) : null}
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="First Name"
                    id="contact-firstName"
                    name="firstName"
                    data-cy="firstName"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                      minLength: { value: 1, message: 'This field is required to be at least 1 characters.' },
                      maxLength: { value: 50, message: 'This field cannot be longer than 50 characters.' },
                    }}
                    value={firstName}
                    onChange={e => {
                      handleChange(e, setFirstName);
                    }}
                  />
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="Last Name"
                    id="contact-lastName"
                    name="lastName"
                    data-cy="lastName"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                      minLength: { value: 1, message: 'This field is required to be at least 1 characters.' },
                      maxLength: { value: 50, message: 'This field cannot be longer than 50 characters.' },
                    }}
                    value={lastName}
                    onChange={e => {
                      handleChange(e, setLastName);
                    }}
                  />
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="Email"
                    id="contact-email"
                    name="email"
                    data-cy="email"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                      minLength: { value: 5, message: 'This field is required to be at least 5 characters.' },
                      maxLength: { value: 50, message: 'This field cannot be longer than 50 characters.' },
                    }}
                    value={email}
                    onChange={e => {
                      handleChange(e, setEmail);
                    }}
                  />
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="Phone Number"
                    id="contact-phoneNumber"
                    name="phoneNumber"
                    data-cy="phoneNumber"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                    }}
                    value={phoneNumber}
                    onChange={e => {
                      handleChange(e, setPhoneNumber);
                    }}
                  />
                  <ValidatedField
                    className="col-12"
                    label="Address 1"
                    id="contact-address1"
                    name="address1"
                    data-cy="address1"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                    }}
                    value={address1}
                    onChange={e => {
                      handleChange(e, setAddress1);
                    }}
                  />
                  <ValidatedField
                    className="col-12"
                    label="Address 2"
                    id="contact-address2"
                    name="address2"
                    data-cy="address2"
                    type="text"
                    value={address2}
                    onChange={e => {
                      handleChange(e, setAddress2);
                    }}
                  />
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="City"
                    id="contact-city"
                    name="city"
                    data-cy="city"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                    }}
                    value={city}
                    onChange={e => {
                      handleChange(e, setCity);
                    }}
                  />
                  <ValidatedField
                    className="col-12 col-lg-4"
                    label="State"
                    id="contact-state"
                    name="state"
                    data-cy="state"
                    type="select"
                    value={state}
                    onChange={e => {
                      handleChange(e, setState);
                    }}
                  >
                    {statesValues.map(states => (
                      <option value={states} key={states}>
                        {states}
                      </option>
                    ))}
                  </ValidatedField>
                  <ValidatedField
                    className="col-12 col-lg-2"
                    label="Zip Code"
                    id="contact-zipCode"
                    name="zipCode"
                    data-cy="zipCode"
                    type="text"
                    validate={{
                      required: { value: true, message: 'This field is required.' },
                      minLength: { value: 5, message: 'This field is required to be at least 5 characters.' },
                      maxLength: { value: 10, message: 'This field cannot be longer than 10 characters.' },
                    }}
                    value={zipCode}
                    onChange={e => {
                      handleChange(e, setZipCode);
                    }}
                  />
                  <div className="col-12 col-lg-6 mb-3">
                    <Label htmlFor="categories">Categories</Label>
                    <Select
                      id="contact-categories"
                      name="categories"
                      data-cy="categories"
                      isMulti={true}
                      isSearchable={true}
                      getOptionValue={option => option.id}
                      getOptionLabel={option => option.name}
                      options={categories.map((c: ICategory) => ({ id: c.id, name: c.name }))}
                      isClearable={true}
                      closeMenuOnSelect={false}
                      openMenuOnFocus={true}
                      value={categoriesSelected}
                      backspaceRemovesValue={true}
                      onChange={e => {
                        setCategoriesSelected([...e]);
                      }}
                    />
                  </div>
                  <ValidatedField
                    className="col-12 col-lg-6"
                    label="Birth Date"
                    id="contact-birthDate"
                    name="birthDate"
                    data-cy="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={e => {
                      handleChange(e, setBirthDate);
                    }}
                  />
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <Button
                      className="btn btn-lg btn-outline-info rounded-pill px-4 py-2"
                      tag={Link}
                      id="cancel-save"
                      data-cy="entityCreateCancelButton"
                      to="/contact"
                      replace
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      &nbsp; Cancel
                    </Button>
                    <Button
                      className="btn btn-lg btn-primary rounded-pill px-4 py-2"
                      id="save-entity"
                      data-cy="entityCreateSaveButton"
                      type="submit"
                      disabled={updating}
                    >
                      <FontAwesomeIcon icon="save" />
                      &nbsp; Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ValidatedForm>
        )}
      </div>
    </>
  );
};

export default ContactUpdate;
