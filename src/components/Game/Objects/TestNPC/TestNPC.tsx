import React, { FunctionComponent, useEffect, useState } from 'react';
import { useKeyboardContext } from '../../../../services/Keyboard';
import './TestNPC.css';

type Props = {
  startedLocation?: {
    left: number;
    top: number;
  };
};

const TestNPC: FunctionComponent<Props> = ({
  startedLocation = {
    left: 50,
    top: 50,
  },
}) => {
  const { keyPressed } = useKeyboardContext();
  const [location, setLocation] = useState(startedLocation);

  useEffect(() => {
    const newLocation = { ...location };
    if (keyPressed.up()) newLocation.top -= 10;
    if (keyPressed.down()) newLocation.top += 10;
    if (keyPressed.left()) newLocation.left -= 10;
    if (keyPressed.right()) newLocation.left += 10;
    setLocation(newLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyPressed]);

  useEffect(() => {
    // setContextTestNPCLocastion
  }, [location]);
  return <div className="Objects_TestNPC" style={{ left: location.left, top: location.top }}></div>;
};

export default React.memo(TestNPC);
