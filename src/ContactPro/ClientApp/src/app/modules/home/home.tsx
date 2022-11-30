import React from 'react';
// import { demo } from 'app/shared/reducers/authentication';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const Home = () => {
  // const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  return (
    <div className="row align-items-center h-100">
      <div className="col-12 col-md-6 col-lg-5 order-last order-md-first">
        <div className="ms-5">
          <h1 className="heroTitle">
            All your <span className="texthighlight">contacts</span> in one place
          </h1>
          <div className="subtitle">
            Organize your events by keeping everyone in the loop. Experience the power of ContactPro demo it today!
            <br />
            <br />
            <strong>Built with pride using cutting edge tech:</strong>
            <br />
            <div className="d-flex flex-wrap mt-1">
              <i className="devicon-spring-plain-wordmark colored icon"></i>
              <i className="devicon-java-plain-wordmark colored icon"></i>
              <i className="devicon-react-original-wordmark colored icon"></i>
              <i className="devicon-javascript-plain colored icon"></i>
              <i className="devicon-postgresql-plain-wordmark colored icon"></i>
              <i className="devicon-bootstrap-plain-wordmark colored icon"></i>
            </div>
          </div>
          {!isAuthenticated ? (
            <div className="text-start mt-5">
              <button
                className="btn btn-lg btn-primary rounded-pill demo-button"
                onClick={() => {
                  // dispatch(demo());
                }}
              >
                DEMO
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-7 text-center">
        <img src="content/img/contactProLanding.png" className="img-fluid" />
      </div>
    </div>
  );
};

export default Home;
