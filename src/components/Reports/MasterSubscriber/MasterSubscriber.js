import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import MasterSubscriberCurrentSearch from './MasterSubscriberCurrentSearch/MasterSubscriberCurrentSearch';
import { Formik, Form, Field } from 'formik';

const minSearchChars = 3;

const MasterSubscriber = () => {
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
      <FormattedMessage id="master_subscriber.page_title">
        {(page_title) => (
          <Helmet>
            <title>{page_title}</title>
            <meta name="description" content={_('master_subscriber.page_description')} />
          </Helmet>
        )}
      </FormattedMessage>
      <header className="report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h3>
                <FormattedMessage id="master_subscriber.header_title" />
              </h3>
              <span className="arrow" />
            </div>
          </div>
        </div>
      </header>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-t-24">
            <div className="dp-block-wlp">
              <Formik initialValues={getFormInitialValues()} onSubmit={onSubmit}>
                {({ submitForm, handleChange, errors, touched }) => (
                  <div>
                    <Form
                      className="dp-filters"
                      role="search"
                      aria-label={_('master_subscriber.search_form.aria_label')}
                      id="searchMasterSubscriber"
                    >
                      <fieldset>
                        <legend>{_('master_subscriber.search_form.search_form_legend')}</legend>
                        <ul class="field-group dp-rowflex" aria-labelledby="searchMasterSubscriber">
                          <li class="field-item col-lg-6 col-md-6 col-sm-12 dp-t-inputsh">
                            <Field
                              className="dp-searchemail"
                              aria-label={_('master_subscriber.search_form.aria_search_field')}
                              aria-required="true"
                              name="search"
                              type="text"
                              placeholder={_(
                                'master_subscriber.search_form.search_field_placeholder',
                              )}
                              value={state.subscriberSearch}
                              onChange={(e) => {
                                const { value } = e.target;
                                setState({ subscriberSearch: value });
                                handleChange(e);
                              }}
                              validate={validateSearch}
                            />
                            <button
                              className="dp-button button-medium dp-button--search"
                              aria-label="click search"
                              type="submit"
                            >
                              <span className="ms-icon icon-search"></span>
                            </button>
                            <div class="dp-message dp-error-form">
                              <p>{_('validation_messages.error_required_field')}</p>
                            </div>
                          </li>
                        </ul>
                      </fieldset>
                    </Form>
                    {errors.search && touched.search && <div>{errors.search}</div>}
                  </div>
                )}
              </Formik>
            </div>
            <div className="dp-block-wlp m-b-36">
              {state.showResults ? (
                <MasterSubscriberCurrentSearch searchText={state.searchText} />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MasterSubscriber;
