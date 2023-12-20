import React, { FunctionComponent } from 'react';
import './Options.css';
import { useMySelector } from '../../services/Game/contextExperiment';

const OptionsInt: FunctionComponent = () => {
  const someInt = useMySelector((state) => state.someInt);
  console.log('rerender OptionsInt', someInt);
  return <div>Cos : {someInt}</div>;
};

export default React.memo(OptionsInt);
