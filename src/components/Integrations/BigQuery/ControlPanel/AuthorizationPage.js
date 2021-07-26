import React, { useState, useEffect } from 'react';
import { Loading } from '../../../Loading/Loading';
import { AuthorizationForm } from './AuthorizationForm';
import { InjectAppServices } from '../../../../services/pure-di';
import useTimeout from '../../../../hooks/useTimeout';

const AuthorizationLayout = ({ dependencies: { bigQueryClient } }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchData = async () => {
      const result = await bigQueryClient.getEmailsData();
      if (result.success) {
        setData(result.value.emails);
      }
      setLoading(false);
    };

    fetchData();
  }, [bigQueryClient]);

  const onSubmit = async (values) => {
    // TODO: integrate actual implementation to save
    await new Promise((resolve) => {
      createTimeout(() => {
        resolve(true);
        alert('Sent: ' + JSON.stringify([...values.emails]));
      }, 100);
    });
  };

  if (loading) {
    return <Loading page />;
  }

  return (
    <div className="dp-container">
      <div className="dp-rowflex p-t-48">
        <div className="col-lg-5">
          <AuthorizationForm emails={data} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export const AuthorizationPage = InjectAppServices(AuthorizationLayout);
