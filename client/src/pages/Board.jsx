import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { Box, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";
import { setBoards } from "../redux/features/boardSlice";
import { setFavouriteList } from "../redux/features/favouriteSlice";
import Tooltip from "@mui/material/Tooltip";

// Setting timer and timeout variables
let timer;
const timeout = 500;

const Board = () => {
    // Initializing Redux dispatch and React Router hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { boardId } = useParams();

    // Initializing state variables for board details
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sections, setSections] = useState([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [icon, setIcon] = useState("");

    // Getting boards and favourite list from Redux store
    const boards = useSelector((state) => state.board.value);
    const favouriteList = useSelector((state) => state.favourites.value);

    // Fetching board details on component mount
    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = await boardApi.getOne(boardId);
                setTitle(res.title);
                setDescription(res.description);
                setSections(res.sections);
                setIsFavourite(res.favourite);
                setIcon(res.icon);
            } catch (err) {
                alert(err);
            }
        };
        getBoard();
    }, [boardId]);

    // Function to handle changes to the board icon
    const onIconChange = async (newIcon) => {
        // Updating icon in boards array
        let temp = [...boards];
        const index = temp.findIndex((e) => e.id === boardId);
        temp[index] = { ...temp[index], icon: newIcon };

        // Updating icon in favourite list if board is a favourite
        if (isFavourite) {
            let tempFavourite = [...favouriteList];
            const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
            tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon };
            dispatch(setFavouriteList(tempFavourite));
        }

        // Updating state and Redux store
        setIcon(newIcon);
        dispatch(setBoards(temp));

        // Updating board icon in API
        try {
            await boardApi.update(boardId, { icon: newIcon });
        } catch (err) {
            alert(err);
        }
    };

    // Function to handle changes to the board title
    const updateTitle = async (e) => {
        // Clearing timer and updating title state variable
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Updating title in boards array
        let temp = [...boards];
        const index = temp.findIndex((e) => e.id === boardId);
        temp[index] = { ...temp[index], title: newTitle };

        // Updating title in favourite list if board is a favourite
        if (isFavourite) {
            let tempFavourite = [...favouriteList];
            const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
            tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle };
            dispatch(setFavouriteList(tempFavourite));
        }

        // Updating Redux store
        dispatch(setBoards(temp));

        // Updating board title in API after timeout
        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId, { title: newTitle });
            } catch (err) {
                alert(err);
            }
        }, timeout);
    };

    // Function to handle changes to the board description
    const updateDescription = async (e) => {
        // Clearing timer and updating description state variable
        clearTimeout(timer);
        const newDescription = e.target.value;
        setDescription(newDescription);

        // Updating board description in API after timeout
        timer = setTimeout(async () => {
            try {
                await boardApi.update(boardId, { description: newDescription });
            } catch (err) {
                alert(err);
            }
        }, timeout);
    };

    // Function to add or remove board from favourites
    const addFavourite = async () => {
        try {
            // Updating favourite status in API
            const board = await boardApi.update(boardId, { favourite: !isFavourite });

            // Updating favourite list in Redux store
            let newFavouriteList = [...favouriteList];
            if (isFavourite) {
                newFavouriteList = newFavouriteList.filter((e) => e.id !== boardId);
            } else {
                newFavouriteList.unshift(board);
            }
            dispatch(setFavouriteList(newFavouriteList));

            // Updating favourite state variable
            setIsFavourite(!isFavourite);
        } catch (err) {
            alert(err);
        }
    };

    // Function to delete board
    const deleteBoard = async () => {
        try {
            // Deleting board from API
            await boardApi.delete(boardId);

            // Removing board from favourite list if it is a favourite
            if (isFavourite) {
                const newFavouriteList = favouriteList.filter((e) => e.id !== boardId);
                dispatch(setFavouriteList(newFavouriteList));
            }

            // Removing board from boards array and navigating to a different board
            const newList = boards.filter((e) => e.id !== boardId);
            if (newList.length === 0) {
                navigate("/boards");
            } else {
                navigate(`/boards/${newList[0].id}`);
            }
            dispatch(setBoards(newList));
        } catch (err) {
            alert(err);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 50px",
                }}
            >
                <Tooltip title="Add to Favorite">
                <IconButton variant="outlined" onClick={addFavourite}>
                    {isFavourite ? <StarOutlinedIcon color="warning" /> : <StarBorderOutlinedIcon />}
                </IconButton>
                </Tooltip>

                <Tooltip title="Delete Project">
                    <IconButton variant="outlined" color="error" onClick={deleteBoard}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ padding: "10px 50px" }}>
                <Box>
                    {/* emoji picker */}
                    <EmojiPicker icon={icon} onChange={onIconChange} />
                    <TextField
                        value={title}
                        onChange={updateTitle}
                        placeholder="Untitled"
                        variant="outlined"
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-input": { padding: 0 },
                            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
                        }}
                    />
                    <TextField
                        value={description}
                        onChange={updateDescription}
                        placeholder="Add a description"
                        variant="outlined"
                        multiline
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-input": { padding: 0 },
                            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                            "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
                        }}
                    />
                </Box>
                <Box>
                    {/* Kanban board */}
                    <Kanban data={sections} boardId={boardId} />
                </Box>
            </Box>
        </>
    );
};

export default Board;
