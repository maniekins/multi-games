import React, { FunctionComponent } from 'react';
import './Options.css';
import { useMySelector } from '../../services/Game/contextExperiment';

const Options2: FunctionComponent = () => {
  const someVal = useMySelector((state) => state.someVal);
  console.log('rerender Options2', someVal);
  return <div>Cos : {someVal}</div>;
};

export default React.memo(Options2);
