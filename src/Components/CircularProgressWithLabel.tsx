// import React from 'react';
// import CircularProgress, { circularProgressClasses, CircularProgressProps } from '@mui/material/CircularProgress';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// // Extend CircularProgressProps to include any additional props
// // For this example, we're not adding new props but using CircularProgressProps directly
// interface CircularProgressWithLabelProps extends CircularProgressProps {
//     value: number; // Specify that value is required
// }

// const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = (props) => {
//     return (
//         <Box sx={{ position: 'relative', display: 'inline-flex' }}>
//             <CircularProgress
//                 variant="determinate"
//                 {...props}
//                 sx={{
//                     color: (theme) =>
//                         props.value >= 75 ? theme.palette.success.main :
//                             props.value >= 50 ? theme.palette.warning.main : theme.palette.error.main,
//                     [`& .${circularProgressClasses.circle}`]: {
//                         strokeLinecap: 'round',
//                     },
//                 }}
//             />
//             <Box
//                 sx={{
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     position: 'absolute',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }}
//             >
//                 <Typography variant="caption" component="div" color="text.primary">{`${Math.round(props.value)}%`}</Typography>
//             </Box>
//         </Box>
//     );
// };

// export default CircularProgressWithLabel;
