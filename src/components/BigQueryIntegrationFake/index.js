import React, { useState, useEffect } from 'react';
import { Loading } from '../Loading/Loading';
import useTimeout from '../../hooks/useTimeout';
import { BigQueryAuthorizationForm } from './BigQueryAuthorizationForm';

export const BigQueryIntegrationFake = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchInfo = () => [
      'allanwatts@gmail.com',
      'mdirago@gmail.com',
      'casco@gmail.com',
      'carlos-sampedro@gmail.com',
      'jose_luis_alvarez_arguelles@gmail.com',
    ];
    setLoading(true);
    createTimeout(() => {
      const data = fetchInfo();
      setEmails([...data, '']);
      setLoading(false);
    }, 1500);
  }, [createTimeout]);

  if (loading) {
    return <Loading page />;
  }

  return (
    <div className="dp-container">
      <div className="dp-rowflex p-t-48">
        <div className="col-lg-5">
          <BigQueryAuthorizationForm initialValues={emails} />
        </div>
      </div>
    </div>
  );
};
