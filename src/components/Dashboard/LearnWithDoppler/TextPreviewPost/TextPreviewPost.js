import React from 'react';
import { useIntl } from 'react-intl';

export const TextPreviewPost = ({ post }) => {
  const { title, description, link, linkDescription } = post;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h3>{_(title)}</h3>
      <p>{_(description)}</p>
      <a href={_(link)} target="_blank">
        <span className="ms-icon icon-arrow-next"></span>
        {_(linkDescription)}
      </a>
    </>
  );
};
