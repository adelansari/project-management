import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { setBoards } from "../redux/features/boardSlice";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import { useState } from "react";

const Home = () => {
  // Getting navigate function from useNavigate hook and dispatch function from useDispatch hook
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Defining loading state variable
  const [loading, setLoading] = useState(false);

  // Function to handle creation of a new board
  const createBoard = async () => {
    // Setting loading state to true
    setLoading(true);

    try {
      // Creating new board using boardApi
      const res = await boardApi.create();

      // Updating boards in Redux store and navigating to new board
      dispatch(setBoards([res]));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    } finally {
      // Setting loading state to false
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingButton
        variant="outlined"
        color="primary"
        onClick={createBoard}
        loading={loading}
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  );
};

export default Home;
