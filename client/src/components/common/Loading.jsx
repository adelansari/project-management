import { Box, CircularProgress } from "@mui/material";

/**
 * A component that displays a circular progress indicator in the center of the screen.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.fullHeight - Whether the component should have full height (i.e. 100vh).
 */
const Loading = (props) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: props.fullHeight ? "100vh" : "100%", // Set the height of the container based on the fullHeight prop.
            }}
        >
            <CircularProgress /> {/* Display a circular progress indicator */}
        </Box>
    );
};

export default Loading;
