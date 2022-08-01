import React, { FunctionComponent, useMemo } from 'react';
import CheckPerformance from '../../services/CheckPerformance';
import { useViewContext } from '../../services/View';
import Game from '../Game';
import Menu from '../Menu';

type ContainerProps = {
  children?: React.ReactNode;
};
const Container: FunctionComponent<ContainerProps> = () => {
  const { isViewMenu, isViewRougelike } = useViewContext();
  console.log('xContainer', isViewMenu, isViewRougelike);
  return useMemo(
    () => (
      <>
        {isViewMenu && <Menu />}
        {isViewRougelike && <Game />}
        <CheckPerformance />
      </>
    ),
    [isViewMenu, isViewRougelike],
  );
};

export default React.memo(Container);
