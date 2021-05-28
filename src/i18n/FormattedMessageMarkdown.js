// Based on https://github.com/yahoo/react-intl/issues/513#issuecomment-252083860-permalink
import React from 'react';
import Markdown from 'react-markdown';
import { useIntl } from 'react-intl';
import './FormattedMessageMarkdown.css';

// TODO: do something to build markdown files inside es.json and en.json
// to edit it in a more friendly way, or at least use a different format
// than JSON to allow line breaks.
// TODO: also consider memoize it, for example:
// https://medium.com/@planttheidea/memoize-react-components-33377d7ebb6c
// in order to avoid multiple processing of the same markdown source (Take
// into account the message in the memoization.
// TODO: also consider using always a linkTarget option as function detecting
// not webapp nor doppler legacy links and apply _blank target to them.
export const FormattedMessageMarkdown = ({
  id,
  defaultMessage = '',
  values = '',
  description = '',
  ...rest
}) => (
  <Markdown
    source={useIntl().formatMessage({ id, defaultMessage, description }, values)}
    {...rest}
  />
);
