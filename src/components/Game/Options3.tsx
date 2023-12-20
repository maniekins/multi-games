import React, { FunctionComponent } from 'react';
import './Options.css';
import { useMySelector } from '../../services/Game/contextExperiment';

const Options3: FunctionComponent = () => {
  const someVal2 = useMySelector((state) => state.someVal2);
  // const someVal = useMySelector((state) => state.someVal);
  console.log('rerender Options3', someVal2);
  return <div>Cos : {someVal2}</div>;
};

export default React.memo(Options3);
