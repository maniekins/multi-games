import React, { FunctionComponent, useMemo } from 'react';
import { ModelComponentType } from './types';
import './Tile.css';
import { TYPES } from '../Tile';

type TileProps = {
  type: string;
  children?: React.ReactNode;
  visible?: boolean;
  visited?: boolean;
};

const Tile: FunctionComponent<ModelComponentType & TileProps> = ({
  modelSize,
  style = {},
  type,
  children,
  visible,
  visited,
  ...props
}) => {
  const extra = useMemo(() => (visible || type === TYPES.FOG ? {} : { opacity: 0.2 }), [type, visible]);
  const extra1 = useMemo(() => (visited ? {} : { opacity: 0.05 }), [visited]);

  const styles = useMemo(
    () => ({
      boxShadow: visible ? `inset 0 0 ${modelSize / 4}px gold` : 'none',
      height: modelSize,
      margin: modelSize / 10,
      width: modelSize,
      ...extra,
      ...extra1,
      ...style,
    }),
    [modelSize, style, visible, extra, extra1],
  );

  return (
    <div className={`Model_Component_Tile ${type}`} style={styles} {...props}>
      {children}
    </div>
  );
};

export default React.memo(Tile);
