import { useSelector, useDispatch } from "react-redux";
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import assets from "../../assets/index";
import { useEffect, useState } from "react";
import boardApi from "../../api/boardApi";
import { setBoards } from "../../redux/features/boardSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FavouriteList from "./FavouriteList";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

const Sidebar = () => {
    // Getting current theme mode from MUI theme
    const theme = useTheme();
    const themeMode = theme.palette.mode;

    // Accessing state values and hooks
    const user = useSelector((state) => state.user.value); // Retrieving user data from Redux store
    const boards = useSelector((state) => state.board.value); // Retrieving boards data from Redux store
    const navigate = useNavigate(); // Navigation hook to change URL
    const dispatch = useDispatch(); // Dispatch hook to dispatch actions
    const { boardId } = useParams(); // Accessing boardId parameter from URL
    const [activeIndex, setActiveIndex] = useState(0); // Initializing activeIndex state

    const sidebarWidth = 300; // Setting sidebar width

    useEffect(() => {
        // Fetching boards data from the API
        const getBoards = async () => {
            try {
                const res = await boardApi.getAll(); // API call to get all boards
                dispatch(setBoards(res)); // Dispatching the setBoards action to update the Redux store with the new data
            } catch (err) {
                alert(err);
            }
        };

        getBoards(); // Calling the getBoards function when the component mounts or whenever the dispatch function changes
    }, [dispatch]);

    useEffect(() => {
        // Handling changes to the boardId parameter
        const activeItem = boards.findIndex((e) => e.id === boardId); // Finding the index of the active board
        if (boards.length > 0 && boardId === undefined) {
            navigate(`/boards/${boards[0].id}`); // Navigating to the first board if there is no boardId parameter
        }
        setActiveIndex(activeItem); // Setting the activeIndex state
    }, [boards, boardId, navigate]);

    const logout = () => {
        // Handling logout functionality
        localStorage.removeItem("token"); // Removing the token from local storage
        navigate("/login"); // Navigating to the login page
    };

    const onDragEnd = async ({ source, destination }) => {
        // Handling drag and drop functionality
        const newList = [...boards]; // Creating a new array with the current board data
        const [removed] = newList.splice(source.index, 1); // Removing the dragged board from the array
        newList.splice(destination.index, 0, removed); // Inserting the dragged board at the new position

        const activeItem = newList.findIndex((e) => e.id === boardId); // Finding the index of the active board in the new array
        setActiveIndex(activeItem); // Setting the activeIndex state
        dispatch(setBoards(newList)); // Dispatching the setBoards action to update the Redux store with the new array

        try {
            await boardApi.updatePositoin({ boards: newList }); // API call to update the position of the boards
        } catch (err) {
            alert(err);
        }
    };

    const addBoard = async () => {
        // Handling board creation functionality
        try {
            const res = await boardApi.create(); // API call to create a new board
            const newList = [res, ...boards]; // Creating a new array with the new board added at the beginning
            dispatch(setBoards(newList)); // Dispatching the setBoards action to update
            navigate(`/boards/${res.id}`);
        } catch (err) {
            alert(err);
        }
    };

    return (
        <Drawer
            container={window.document.body}
            variant="permanent"
            anchor="right"
            open={true}
            sx={{
                width: sidebarWidth,
                height: "100vh",
                "& > div": { borderRight: "none" },
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: "100vh",
                    backgroundColor: themeMode === "dark" ? assets.colors.secondary : assets.colors.primary,
                }}
            >
                <ListItem>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: 2,
                            borderRadius: 2,
                            borderColor: "primary.main",
                            p: 2,
                        }}
                    >
                        <Box>
                            <img src={themeMode === "dark" ? assets.images.logoDark : assets.images.logoLight} style={{ width: "100px" }} alt="app logo" />
                            <Typography variant="h6" fontWeight="700">
                                User: {user.username}
                            </Typography>
                        </Box>
                        <Tooltip title="Logout">
                            <IconButton onClick={logout} style={{ color: "red", boxShadow: "0 0 15px white"}}>
                                <LogoutOutlinedIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </ListItem>
                <Divider />
                <Box sx={{ paddingTop: "10px" }} />
                <FavouriteList />
                <Box sx={{ paddingTop: "10px" }} />
                <ListItem>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            Private
                        </Typography>
                        <IconButton onClick={addBoard}>
                            <AddBoxOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </ListItem>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable key={"list-board-droppable-key"} droppableId={"list-board-droppable"}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {boards.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItemButton
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                selected={index === activeIndex}
                                                component={Link}
                                                to={`/boards/${item.id}`}
                                                sx={{
                                                    pl: "20px",
                                                    cursor: snapshot.isDragging ? "grab" : "pointer!important",
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight="700" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {item.icon} {item.title}
                                                </Typography>
                                            </ListItemButton>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </List>
        </Drawer>
    );
};

export default Sidebar;
