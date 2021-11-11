import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { SubscriberListState } from '../../services/shopify-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfinitePaged } from '../../hooks/useInfinitePaged';
import { IconMessage } from '../form-helpers/form-helpers';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { ConfirmationBox } from '../shared/ConfirmationBox/ConfirmationBox';

export const scrollableContainerId = 'scrollable-container';

const ListRow = ({ list, selected, onSelectChange, disabled }) => {
  return (
    <tr>
      <td aria-label="List Check">
        <label className={'dp-list-check' + (disabled ? ' dp-inputcheck-disabled' : '')}>
          <input
            type="checkbox"
            defaultChecked={selected}
            onChange={() => onSelectChange(list)}
            disabled={disabled}
          />
          <span className="checkmark" />
        </label>
      </td>
      <td aria-label="Name">
        <span>{list.name}</span>
      </td>
      <td aria-label="Subscribers Amount">
        <span>{list.amountSubscribers}</span>
      </td>
    </tr>
  );
};

const ListTable = ({ lists, limitReached, selectedIds, onSelectChange }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <table className="dp-c-table">
      <thead>
        <tr>
          <th>
            <img
              src={_('common.ui_library_image', { imageUrl: 'check-grey.svg' })}
              alt="Check list"
            />
          </th>
          <th>
            <div className="dp-icon-wrapper">
              {_('subscriber_list_selector.table_columns.list_name')}
              <span className="ms-icon icon-AZ" />
            </div>
          </th>
          <th>
            <div className="dp-icon-wrapper">
              {_('subscriber_list_selector.table_columns.subscribers')}
              <span className="ms-icon icon-AZ" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {lists.map((list) => (
          <ListRow
            list={list}
            key={list.id}
            selected={selectedIds.includes(list.id)}
            onSelectChange={onSelectChange}
            disabled={limitReached && !selectedIds.includes(list.id)}
          />
        ))}
      </tbody>
    </table>
  );
};

export const SubscriberListSelector = InjectAppServices(
  ({
    dependencies: { dopplerApiClient },
    maxToSelect,
    preselected,
    messageKeys,
    onCancel,
    onConfirm,
    onNoList,
    onError,
  }) => {
    const fetchData = useCallback(
      (page) => dopplerApiClient.getSubscribersLists(page, SubscriberListState.ready),
      [dopplerApiClient],
    );
    const { loading, fetching, error, items, hasMoreItems, loadMoreItems } =
      useInfinitePaged(fetchData);
    const [selected, setSelected] = useState([]);
    const [limitReached, setLimitReached] = useState(false);
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const validateMaxLimit = useCallback(() => {
      if (maxToSelect) {
        setLimitReached(selected.length === maxToSelect);
      }
    }, [maxToSelect, selected, setLimitReached]);

    useEffect(() => {
      if (!loading && !fetching) {
        if (error) {
          onError?.();
        } else if (items.length === 0) {
          onNoList?.();
        }
      }
    }, [loading, fetching, error, items, onError, onNoList]);

    useEffect(() => {
      setSelected(preselected);
      validateMaxLimit();
    }, [validateMaxLimit, preselected]);

    const handleSelectChange = (list) => {
      setConfirmDisabled(false);
      const newSelected = selected;
      const index = newSelected.findIndex((item) => item.id === list.id);

      if (index > -1) {
        newSelected.splice(index, 1);
      } else {
        const { id, name } = list;
        newSelected.push({ id, name });
      }

      setSelected(newSelected);
      validateMaxLimit();
    };

    if (loading) {
      return <Loading page />;
    }

    if (!error && items.length === 0) {
      return (
        <ConfirmationBox
          logo={_('common.ui_library_image', { imageUrl: 'lists.svg' })}
          title={_('subscriber_list_selector.no_list.title')}
          description={
            <FormattedMessageMarkdown id={'subscriber_list_selector.no_list.description_MD'} />
          }
          paragraph={_('subscriber_list_selector.no_list.strong_text')}
          cancelButtonText={_('subscriber_list_selector.no_list.not_now')}
          actionButtonText={_('subscriber_list_selector.no_list.create_list')}
          onCancel={onCancel}
          onAction={() => {
            window.location.href = _('subscriber_list_selector.no_list.create_list_url');
          }}
        />
      );
    }

    return (
      <>
        {messageKeys?.title ? <h2 className="modal-title">{_(messageKeys?.title)}</h2> : null}

        {messageKeys?.description ? (
          <FormattedMessageMarkdown id={messageKeys?.description} values={{ maxToSelect }} />
        ) : null}

        {limitReached ? (
          <IconMessage
            text={messageKeys?.maxLimitExceeded ?? 'subscriber_list_selector.max_limit_exceeded'}
            fullContent={true}
          />
        ) : null}

        {error ? (
          <IconMessage
            text={'subscriber_list_selector.error_loading_list'}
            fullContent={true}
            type={'cancel'}
          />
        ) : null}

        {items.length > 0 ? (
          <article className="dp-content-list">
            <div className="dp-table-scroll-container">
              <div
                id={scrollableContainerId}
                className="dp-table-scroll"
                data-testid={scrollableContainerId}
              >
                <InfiniteScroll
                  dataLength={items.length}
                  next={loadMoreItems}
                  hasMore={hasMoreItems}
                  loader={<p>Loading...</p>}
                  scrollableTarget={scrollableContainerId}
                >
                  <ListTable
                    lists={items}
                    limitReached={limitReached}
                    selectedIds={selected.map((i) => i.id)}
                    onSelectChange={handleSelectChange}
                  />
                </InfiniteScroll>
              </div>
            </div>
          </article>
        ) : null}

        <div className="dp-cta-modal">
          <button
            type="button"
            className="dp-button button-medium primary-grey"
            onClick={() => onCancel()}
          >
            {_('common.cancel')}
          </button>
          <button
            type="button"
            className="dp-button button-medium primary-green"
            onClick={() => onConfirm(selected)}
            disabled={confirmDisabled}
          >
            {_('subscriber_list_selector.confirm_selection')}
          </button>
        </div>
      </>
    );
  },
);
SubscriberListSelector.propTypes = {
  maxToSelect: PropTypes.number,
  preselected: PropTypes.array,
  messageKeys: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    maxLimitExceeded: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onNoList: PropTypes.func,
  onError: PropTypes.func,
};
