import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import SubscriberHistoryCurrentSearch from './SubscriberHistoryCurrentSearch/SubscriberHistoryCurrentSearch';
import { Formik, Form, Field } from 'formik';

const minSearchChars = 3;

const SubscriberHistory = () => {
  const intl = useIntl();
  const [state, setState] = useState({ subscriberSearch: '' });
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const fieldNames = {
    search: 'search',
  };

  const getFormInitialValues = () => {
    const values = Object.keys(fieldNames).reduce(
      (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
      {},
    );

    return values;
  };

  const validateSearch = (value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (value.length < minSearchChars) {
      error = 'Need ' + minSearchChars + ' characters at least';
    }
    return error;
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setState({ showResults: true, searchText: state.subscriberSearch });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormattedMessage id="subscriber_history.page_title">
        {(page_title) => (
          <Helmet>
            <title>{page_title}</title>
            <meta name="description" content={_('subscriber_history.page_description')} />
          </Helmet>
        )}
      </FormattedMessage>
      <header className="report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h3>
                <FormattedMessage id="subscriber_history.header_title" />
              </h3>
              <span className="arrow" />
            </div>
          </div>
        </div>
      </header>
      <div className="dp-box-shadow col-md-8 col-sm-8" style={{ margin: '80px auto' }}>
        <div className="col-md-8 col-sm-8" style={{ padding: '30px' }}>
          Email Suscriptor
          <Formik initialValues={getFormInitialValues()} onSubmit={onSubmit}>
            {({ submitForm, handleChange, errors, touched }) => (
              <div>
                <Form style={{ display: 'flex' }}>
                  <Field
                    name="search"
                    type="text"
                    value={state.subscriberSearch}
                    onChange={(e) => {
                      const { value } = e.target;
                      setState({ subscriberSearch: value });
                      handleChange(e);
                    }}
                    validate={validateSearch}
                  />
                  <button className="dp-button button-medium primary-grey" type="submit">
                    Buscar
                  </button>
                </Form>
                {errors.search && touched.search && <div>{errors.search}</div>}
              </div>
            )}
          </Formik>
        </div>
        <div style={{ padding: '30px', position: 'relative' }}>
          {state.showResults ? (
            <SubscriberHistoryCurrentSearch searchText={state.searchText} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SubscriberHistory;
