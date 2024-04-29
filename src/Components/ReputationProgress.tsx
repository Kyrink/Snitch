// // ReputationProgress.tsx
// import React from 'react';
// import CircularProgressWithLabel from './CircularProgressWithLabel'; // Adjust the import path as needed
// import { useCountUp } from 'use-count-up';

// interface ReputationProgressProps {
//   reputation: number; // Expected reputation score to be passed as a prop
// }

// const ReputationProgress: React.FC<ReputationProgressProps> = ({ reputation }) => {
//   const { value } = useCountUp({
//     isCounting: true,
//     end: reputation,
//     start: 0,
//     duration: 2,
//     easing: 'easeOutCubic',
//   });

//   return (
//     <CircularProgressWithLabel value={value as number} size={100} thickness={5} />
//   );
// };

// export default ReputationProgress;
