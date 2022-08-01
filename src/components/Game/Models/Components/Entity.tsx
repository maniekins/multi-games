import React from 'react';

// const tileStyle = (modelsize) => ({
//   height: modelsize,
//   margin: 1,
//   width: modelsize,
// });

// const Entity = ({ style, children, modelsize, ...props }) => {
//   return (
//     <div style={{ ...tileStyle(modelsize), ...style }} {...props}>
//       {children}
//     </div>
//   );
// };
const Entity = () => <div />;
export default React.memo(Entity);
