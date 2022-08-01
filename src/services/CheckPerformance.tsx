import React, { FunctionComponent, useEffect } from 'react';
import { useViewActions } from './View';

const CheckPerformance: FunctionComponent = () => {
  const { setViewMenu } = useViewActions();
  console.log('CheckPerformance', setViewMenu);

  useEffect(() => {
    console.log('asd');
  }, [setViewMenu]);
  return null;
};

export default React.memo(CheckPerformance);
