import React, { useMemo } from 'react';
import { useViewActions } from '../../services/View';

const Menu = () => {
  const { setViewRougelike } = useViewActions();
  console.log('xMenu');
  return useMemo(
    () => (
      <div>
        <button onClick={setViewRougelike}>Enter The Rougelike</button>
      </div>
    ),
    [setViewRougelike],
  );
};

export default React.memo(Menu);
