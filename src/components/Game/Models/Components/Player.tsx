import React, { useMemo } from 'react';
import { ModelComponentType } from './types';
import './Player.css';

const Player = ({ modelSize, style = {}, ...props }: ModelComponentType) => {
  const styles = useMemo(
    () => ({
      height: modelSize / 2,
      margin: modelSize / 4,
      width: modelSize / 2,
      ...style,
    }),
    [modelSize, style],
  );

  return <div className="Model_Component_Player" style={styles} {...props}></div>;
};

export default React.memo(Player);
