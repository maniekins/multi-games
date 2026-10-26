import React, { FunctionComponent, useMemo } from 'react';
import CheckPerformance from '../../services/CheckPerformance';
import { useViewContext } from '../../services/View';
import ArithmeticGame from '../ArithmeticGame';
import Game from '../Game';
import Menu from '../Menu';
import SnakeGame from '../SnakeGame';

type ContainerProps = {
  children?: React.ReactNode;
};
const Container: FunctionComponent<ContainerProps> = () => {
  const { isViewMenu, isViewRougelike, isViewArithmetic, isViewSnake } = useViewContext();
  return useMemo(
    () => (
      <>
        {isViewMenu && <Menu />}
        {isViewRougelike && <Game />}
        {isViewArithmetic && <ArithmeticGame />}
        {isViewSnake && <SnakeGame />}
        <CheckPerformance />
      </>
    ),
    [isViewMenu, isViewRougelike, isViewArithmetic, isViewSnake],
  );
};

export default React.memo(Container);
