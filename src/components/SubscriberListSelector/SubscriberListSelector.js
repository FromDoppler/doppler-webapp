import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { SubscriberListState } from '../../services/shopify-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfinitePaged } from '../../hooks/useInfinitePaged';
import { IconMessage } from '../form-helpers/form-helpers';

const ListRow = ({ list, selected }) => {
  return (
    <tr>
      <td aria-label="List Check">
        <label className="dp-list-check">
          <input type="checkbox" defaultChecked={!!selected} />
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

const ListTable = ({ lists, selectedIds }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <table
      className="dp-c-table"
      aria-label="Selección de listas a excluir de la regla"
      summary="Selección de listas a excluir de la regla"
    >
      <thead>
        <tr>
          <th>
            <img
              src={_('common.ui_library_image', { imageUrl: 'check-grey.svg' })}
              alt="check list"
            />
          </th>
          <th>Nombre de la lista</th>
          <th>suscriptores</th>
        </tr>
      </thead>
      <tbody>
        {lists.map((list) => (
          <ListRow list={list} key={list.id} selected={selectedIds.includes(list.id)} />
        ))}
      </tbody>
    </table>
  );
};

export const SubscriberListSelector = InjectAppServices(
  ({ dependencies: { dopplerApiClient }, preselected = [] }) => {
    const fetchData = (page) =>
      dopplerApiClient.getSubscribersLists(page, SubscriberListState.ready);
    const { loading, items, hasMoreItems, loadMoreItems } = useInfinitePaged(fetchData);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    if (loading) {
      return <Loading page />;
    }

    return items.length > 0 ? (
      //TODO: Remove inline styles

      <div id="scrollableContainer" style={{ height: 300, overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={items.length}
          next={loadMoreItems}
          hasMore={hasMoreItems}
          loader={<p>Loading...</p>}
          scrollableTarget="scrollableContainer"
        >
          <ListTable lists={items} selectedIds={preselected.map((i) => i.id)} />
        </InfiniteScroll>
      </div>
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
  preselected: PropTypes.array,
};
