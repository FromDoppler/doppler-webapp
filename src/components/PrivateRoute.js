import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { InjectAppServices } from '../services/pure-di';

export default InjectAppServices(function({
  component: Component,
  userData,
  sessionStatus,
  dependencies: { RedirectToLogin },
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStatus === 'authenticated' ? (
          <>
            <Header userData={userData} />
            <Component {...props} />
            <Footer />
          </>
        ) : (
          <RedirectToLogin from={props.location} />
        )
      }
    />
  );
});
