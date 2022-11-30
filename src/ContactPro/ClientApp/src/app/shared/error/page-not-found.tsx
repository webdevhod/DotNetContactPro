import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

class PageNotFound extends React.Component {
  render() {
    return (
      <div className="mainbox">
        <div className="error-code">
          <div className="err">4</div>
          <FontAwesomeIcon className="far" icon={faQuestionCircle} spin />
          <div className="err2">4</div>
        </div>
        <div className="msg">
          Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?
          <p>
            Let&apos;s go <Link to="/">home</Link> and try from there.
          </p>
        </div>
      </div>
    );
  }
}

export default PageNotFound;
