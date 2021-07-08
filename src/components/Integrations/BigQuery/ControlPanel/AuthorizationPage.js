import React, { useState, useEffect } from 'react';
import { Loading } from '../../../Loading/Loading';
import useTimeout from '../../../../hooks/useTimeout';
import { AuthorizationForm } from './AuthorizationForm';

export const AuthorizationPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchInfo = () => ['email1@gmail.com', 'email2@gmail.com'];
    setLoading(true);
    createTimeout(() => {
      setData(fetchInfo());
      setLoading(false);
    }, 2000);
  }, [createTimeout]);

  if (loading) {
    return <Loading page></Loading>;
  }
  return (
    <div className="dp-container">
      <div className="dp-rowflex p-t-48">
        <div className="col-lg-5">
          <AuthorizationForm emails={data}></AuthorizationForm>
        </div>
      </div>
    </div>
  );
};
