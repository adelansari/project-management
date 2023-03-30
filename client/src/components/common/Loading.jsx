import { Box, CircularProgress } from '@mui/material';

// Defining the Loading component with props passed in as an argument
const Loading = (props) => {
  // Returning a Box component with CircularProgress inside it
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: props.fullHeight ? '100vh' : '100%', // Dynamically setting height based on props
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
