import { useEffect, useState } from 'react';
import useTimeout from '../../../hooks/useTimeout';
import PropTypes from 'prop-types';

export const ShowLikeFlash = ({ children, delay }) => {
  const [visibility, setVisibility] = useState(true);

  const createTimeout = useTimeout();
  useEffect(() => {
    if (delay == null) {
      return;
    }
    createTimeout(() => setVisibility(false), delay);
  }, [createTimeout, delay]);

  return visibility ? children : null;
};
ShowLikeFlash.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};
