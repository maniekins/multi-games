import React, { useEffect, useState } from 'react';
import { useGameContext } from '../..';
import './TestNPC.css';

type Props = {
  // children?: React.ReactNode;
};

const TestNPC: React.FC<Props> = () => {
  const { keyPressed } = useGameContext();
  const [location, setLocation] = useState({
    left: 50,
    top: 50,
  });

  useEffect(() => {
    const newLocation = { ...location };
    keyPressed.up() && (newLocation.top -= 10);
    keyPressed.down() && (newLocation.top += 10);
    keyPressed.left() && (newLocation.left -= 10);
    keyPressed.right() && (newLocation.left += 10);
    console.log('keyPressed', keyPressed);
    setLocation(newLocation);
  }, [keyPressed]);
  return <div className="TestNPC" style={{ left: location.left, top: location.top }}></div>;
};

export default React.memo(TestNPC);
