import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { SubscriberListState } from '../../services/shopify-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfinitePaged } from '../../hooks/useInfinitePaged';
import { IconMessage } from '../form-helpers/form-helpers';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

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
  ({ dependencies: { dopplerApiClient }, maxToSelect, preselected, messageKeys }) => {
    const fetchData = (page) =>
      dopplerApiClient.getSubscribersLists(page, SubscriberListState.ready);
    const { loading, items, hasMoreItems, loadMoreItems } = useInfinitePaged(fetchData);
    const [selected, setSelected] = useState([]);
    const [limitReached, setLimitReached] = useState(false);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const validateMaxLimit = () => {
      if (maxToSelect) {
        setLimitReached(selected.length === maxToSelect);
      }
    };

    useEffect(() => {
      setSelected(preselected);
      validateMaxLimit();
    }, [preselected]);

    const handleSelectChange = (list) => {
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

    return items.length > 0 ? (
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

        <article className="dp-content-list">
          <div className="dp-table-scroll-container">
            <div id="scrollableContainer" className="dp-table-scroll">
              <InfiniteScroll
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={hasMoreItems}
                loader={<p>Loading...</p>}
                scrollableTarget="scrollableContainer"
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
      </>
    ) : (
      <section className="dp-gray-page p-t-54 p-b-54">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-lg-6">
              <IconMessage text={_('common.feature_no_available')} />
            </div>
          </div>
        </div>
      </section>
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
};
