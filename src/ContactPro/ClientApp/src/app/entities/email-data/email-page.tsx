import React, { MouseEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from '../contact/contact.reducer';
import { getEntity, updateEntity } from './email-data.reducer';
import Select from 'react-select';
// import { hasAnyAuthority } from 'app/shared/auth/private-route';
// import { AUTHORITIES } from 'app/config/constants';

const EmailPage = (props) => {
  const { match } = props; // if contact, use this reducer, else that reducer.
  const dispatch = useAppDispatch();

  const updateSuccess = useAppSelector(state => state.emailData.updateSuccess);
  // const loading = useAppSelector((state) => state.emailData.loading);
  // const errorMessage = useAppSelector(state => state.emailData.errorMessage);
  
  const emailDataEntity = useAppSelector((state) => state.emailData.entity);
  const [contactsSelected, setContactsSelected] = useState([]);
  const contactList = useAppSelector((state) => state.contact.entities);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isCategory, setIsCategory] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  // const [loaded, setLoaded] = useState(false);
  // const isGuest = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.GUEST]));

  const handleClose = () => {
    props.history.push(isCategory ? "/category" : "/contact");
  };

  useEffect(() => {
    const split: string[] = match.url.split("/");
    setIsCategory(split[1] !== 'contact');
    dispatch(getEntity({id: split[2], isCategory: split[1] !== 'contact' }));
    dispatch(getEntities({}))
  }, []);

  useEffect(() => {
    console.log("emailDataEntity");
    console.log(emailDataEntity);
    if (emailDataEntity != null && emailDataEntity.contacts) {
      setContactsSelected([...emailDataEntity.contacts]);
    }
  }, [emailDataEntity]);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const entity = {
        ...emailDataEntity,
        subject,
        body,
        contacts: contactsSelected
    };
    setEmailSubmitted(true);
    dispatch(updateEntity(entity));
  };

  useEffect(() => {
    if (emailSubmitted) {
      if (updateSuccess) {
        handleClose();
      }
      setEmailSubmitted(false);
    }
  }, [updateSuccess]);

  // useEffect(() => {
  //   if (loaded && errorMessage != null) {
  //     dispatch(reset());
  //     if (isGuest) {
  //       toast.error('Cannot email from demo account. Please sign up for a free user account.');
  //     }
          // props.history.push("/404");
  //   }
  //   if (!loaded) {
  //     setLoaded(true);
  //   }
  // }, [errorMessage]);

  return (
    <>
      <h1>Email</h1>
      <div className="p-2">
        <form method="post">
          <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
            <div className="col col-md-12">
              <label className="form-label" htmlFor="contacts">
                To:
              </label>
              <Select
                className="col mb-3"
                id="category-contact"
                data-cy="contact"
                name="contacts"
                isMulti={true}
                isSearchable={true}
                getOptionValue={option => option.id}
                getOptionLabel={option => `${option.firstName} ${option.lastName} <${option.email}>`}
                options={contactList}
                isClearable={true}
                closeMenuOnSelect={false}
                openMenuOnFocus={true}
                value={contactsSelected}
                backspaceRemovesValue={true}
                onChange={e => {
                  setContactsSelected([...e]);
                }}
              />
            </div>
          </div>
          <div className="row row-cols-1 g-3">
            <div className="col">
              <label className="form-label">Subject:</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                }}
              />
            </div>
            <div className="col">
              <label className="form-label">Message:</label>
              <textarea
                className="form-control"
                rows={10}
                required
                value={body}
                onChange={e => {
                  setBody(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="col text-end">
              <button
                className="btn btn-light rounded-pill btnlinks me-2"
                type="submit"
                onClick={e => {
                  e.preventDefault();
                  handleClose();
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary rounded-pill btnlinks" type="submit" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EmailPage;
