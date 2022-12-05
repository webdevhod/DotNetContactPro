import React, { useLayoutEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/config/store";
import { logout } from "app/shared/reducers/authentication";
import { reset as resetContacts } from "../../entities/contact/contact.reducer";
import { reset as resetCategories } from "../../entities/category/category.reducer";

export const Logout = () => {
  const logoutUrl = useAppSelector((state) => state.authentication.logoutUrl);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(logout());
    dispatch(resetContacts());
    dispatch(resetCategories());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  return (
    <div className="p-5">
      <h4>Logged out successfully!</h4>
    </div>
  );
};

export default Logout;
