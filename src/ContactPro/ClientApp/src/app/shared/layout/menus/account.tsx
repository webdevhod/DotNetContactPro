import React, { useEffect } from "react";
import MenuItem from "app/shared/layout/menus/menu-item";

import { NavDropdown } from "./menu-components";
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
      Settings
    </MenuItem>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      Password
    </MenuItem>
    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      Sign out
    </MenuItem>
  </>
);

const accountMenuItems = () => (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
      Sign in
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register" data-cy="register">
      Register
    </MenuItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false }) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);

  useEffect(() => {
    dispatch(getSession());
  }, []);
  
  return (
    <NavDropdown
      icon="user"
      name={isAuthenticated ? `${account.firstName} ${account.lastName}` : 'Account'}
      id="account-menu"
      data-cy="accountMenu"
    >
      {isAuthenticated ? accountMenuItemsAuthenticated() : accountMenuItems()}
    </NavDropdown>
  );
}

export default AccountMenu;
