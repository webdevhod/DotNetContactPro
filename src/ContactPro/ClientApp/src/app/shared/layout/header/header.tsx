import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { AdminMenu, AccountMenu } from '../menus';
import { useAppDispatch } from 'app/config/store';
import { demo } from 'app/shared/reducers/authentication';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <nav className="navbar navbar-expand-md navbar-light fixed-top border-bottom border-light navShadow">
      <div className="container-fluid">
        <Link className="navbar-brand mb-2 mb-md-0" to="/">
          <img src="content/img/ContactPro.png" height="45" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          {menuOpen ? <FontAwesomeIcon className="navbar-close" icon={faClose} /> : <span className="navbar-toggler-icon"></span>}
        </button>
        <Collapse isOpen={menuOpen} navbar>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item mb-2 mb-md-0">
              <Link className={`nav-link${pathname === '/' ? ' active' : ''}`} aria-current="page" to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            {props.isAuthenticated === true ? (
              <>
                <li className="nav-item mb-2 mb-md-0">
                  <Link className={`nav-link${pathname === '/contact' ? ' active' : ''}`} to="/contact" onClick={closeMenu}>
                    Contacts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${pathname === '/category' ? ' active' : ''}`} to="/category" onClick={closeMenu}>
                    Categories
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
          <ul className="navbar-nav">
            {props.isAuthenticated === false ? (
              <>
                <li className="nav-item me-2 mb-2 mb-md-0">
                  <Link type="button" className="btn btn-primary rounded-pill btnlinks" to="/account/register" onClick={closeMenu}>
                    Register
                  </Link>
                </li>
                <li className="nav-item me-2 mb-2 mb-md-0">
                  <Link type="button" className="btn btn-outline-info rounded-pill btnlinks" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item me-2">
                  <Link
                    to="/"
                    type="button"
                    className="btn btn-outline-primary rounded-pill btnlinks"
                    onClick={() => {
                      dispatch(demo());
                      closeMenu();
                    }}
                  >
                    Demo
                  </Link>
                </li>
              </>
            ) : (
              <>
                {props.isAuthenticated && props.isAdmin && (
                  <AdminMenu showOpenAPI={props.isOpenAPIEnabled} showDatabase={!props.isInProduction} />
                )}
                <AccountMenu isAuthenticated={props.isAuthenticated} />
              </>
            )}
          </ul>
        </Collapse>
      </div>
    </nav>
  );
};

export default Header;
