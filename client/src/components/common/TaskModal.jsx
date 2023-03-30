import { Fade, IconButton, Box, TextField, Typography, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import taskApi from "../../api/taskApi";
import "../../css/custom-editor.css";
import { styled } from "@mui/material/styles";
import { ModalUnstyled } from "@mui/core";

const StyledModal = styled(ModalUnstyled)`
    position: fixed;
    z-index: 1300;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
`;

const Backdrop = styled("div")`
    z-index: -1;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgb(192, 192, 192);
    opacity: 0.6;
    -webkit-tap-highlight-color: transparent;
`;

// Defining modal styles
const modalStyle = {
    outline: "none",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 1,
    height: "80%",
};

// Defining timer and timeout variables
let timer;
const timeout = 500;
let isModalClosed = false;

// Defining TaskModal component
const TaskModal = (props) => {
    // Destructuring boardId from props
    const { boardId } = props;
    // Defining state variables for task, title and content
    const [task, setTask] = useState(props.task);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // Defining ref for editor wrapper
    const editorWrapperRef = useRef();

    // Using useEffect hook to update state when props.task changes
    useEffect(() => {
        setTask(props.task);
        setTitle(props.task !== undefined ? props.task.title : "");
        setContent(props.task !== undefined ? props.task.content : "");
        if (props.task !== undefined) {
            isModalClosed = false;

            updateEditorHeight();
        }
    }, [props.task]);

    // Defining updateEditorHeight function to update the height of the editor
    const updateEditorHeight = () => {
        // Using setTimeout to delay execution
        setTimeout(() => {
            // Checking if editorWrapperRef is defined
            if (editorWrapperRef.current) {
                // Getting the box element
                const box = editorWrapperRef.current;
                // Updating the height of the editor
                box.querySelector(".ck-editor__editable_inline").style.height = box.offsetHeight - 50 + "px";
            }
        }, timeout);
    };

    // Defining onClose function to handle modal closing
    const onClose = () => {
        // Setting isModalClosed to true
        isModalClosed = true;
        // Calling onUpdate and onClose functions from props
        props.onUpdate(task);
        props.onClose();
    };

    // Defining deleteTask function to handle task deletion
    const deleteTask = async () => {
        try {
            // Calling delete function from task API
            await taskApi.delete(boardId, task.id);
            // Calling onDelete function from props
            props.onDelete(task);
            // Setting task state to undefined
            setTask(undefined);
        } catch (err) {
            // Handling errors by displaying an alert
            alert(err);
        }
    };

    // Defining updateTitle function to handle title updates
    const updateTitle = async (e) => {
        // Clearing timer
        clearTimeout(timer);
        // Getting new title from event target value
        const newTitle = e.target.value;
        // Setting timer to delay execution
        timer = setTimeout(async () => {
            try {
                // Calling update function from task API
                await taskApi.update(boardId, task.id, { title: newTitle });
            } catch (err) {
                // Handling errors by displaying an alert
                alert(err);
            }
        }, timeout);

        // Updating task title and title state
        task.title = newTitle;
        setTitle(newTitle);
        // Calling onUpdate function from props with updated task
        props.onUpdate(task);
    };

    // Defining updateContent function to handle content updates
    const updateContent = async (event, editor) => {
        // Clearing timer
        clearTimeout(timer);
        // Getting data from editor
        const data = editor.getData();

        // Logging isModalClosed value for debugging purposes
        console.log({ isModalClosed });

        // Checking if modal is not closed
        if (!isModalClosed) {
            // Setting timer to delay execution
            timer = setTimeout(async () => {
                try {
                    // Calling update function from task API
                    await taskApi.update(boardId, task.id, { content: data });
                } catch (err) {
                    // Handling errors by displaying an alert
                    alert(err);
                }
            }, timeout);

            // Updating task content and content state
            task.content = data;
            setContent(data);
            // Calling onUpdate function from props with updated task
            props.onUpdate(task);
        }
    };

    // Defining a custom upload adapter
    class MyUploadAdapter {
        constructor(loader) {
            // The file loader instance to use during the upload.
            this.loader = loader;
        }

        // Starts the upload process.
        upload() {
            return this.loader.file.then(
                (file) =>
                    new Promise((resolve, reject) => {
                        // Here you can upload the file to your server and return the URL of the uploaded file
                        // For example:
                        const data = new FormData();
                        data.append("file", file);

                        fetch("/api/upload", {
                            method: "POST",
                            body: data,
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                resolve({
                                    default: data.url,
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    })
            );
        }
    }

    return (
        // Using Modal component from Material UI
        <StyledModal
            // Setting open prop based on whether task is defined
            open={task !== undefined}
            // Setting onClose prop to onClose function
            onClose={onClose}
            // Enabling closeAfterTransition prop
            closeAfterTransition
            // Setting BackdropComponent prop to Backdrop component from Material UI
            BackdropComponent={Backdrop}
            // Setting BackdropProps prop to set timeout for Backdrop component
            BackdropProps={{ timeout: 500 }}
        >
            {/* Using Fade component from Material UI for transition effect */}
            <Fade in={task !== undefined}>
                {/* Using Box component from Material UI for modal content */}
                <Box sx={modalStyle}>
                    {/* Using Box component from Material UI for delete button container */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        {/* Using IconButton component from Material UI for delete button */}
                        <IconButton variant="outlined" color="error" onClick={deleteTask}>
                            {/* Using DeleteOutlinedIcon component from Material UI icons for delete button icon */}
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Box>
                    {/* Using Box component from Material UI for modal body container */}
                    <Box
                        sx={{
                            display: "flex",
                            height: "100%",
                            flexDirection: "column",
                            padding: "2rem 5rem 5rem",
                        }}
                    >
                        {/* Using TextField component from Material UI for title input */}
                        <TextField
                            value={title}
                            onChange={updateTitle}
                            placeholder="Untitled"
                            variant="outlined"
                            fullWidth
                            sx={{
                                width: "100%",
                                // Remove padding from input
                                "& .MuiOutlinedInput-input": { padding: 0 },
                                // Remove border from input
                                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "2.5rem",
                                    fontWeight: "700",
                                    // Add transition for box-shadow and background-color
                                    transition: "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                },
                                // Add styles for when the input is focused
                                "& .MuiOutlinedInput-root.Mui-focused": {
                                    boxShadow: "0 0 15px #03a9f4",
                                    backgroundColor: "#f5f5f5",
                                    color: "black",
                                },
                                marginBottom: "10px",
                            }}
                        />
                        {/* Using Typography component from Material UI to display task creation date */}
                        <Typography variant="body2" fontWeight="700">
                            {task !== undefined ? Moment(task.createdAt).format("YYYY-MM-DD") : ""}
                        </Typography>
                        {/* Using Divider component from Material UI to separate title and content */}
                        <Divider sx={{ margin: "1.5rem 0" }} />
                        {/* Using Box component from Material UI for editor container */}
                        <Box
                            ref={editorWrapperRef}
                            sx={{
                                position: "relative",
                                height: "80%",
                                overflowX: "hidden",
                                overflowY: "auto",
                            }}
                        >
                            {/* Using CKEditor component for rich text editing */}
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={updateContent}
                                onFocus={updateEditorHeight}
                                onBlur={updateEditorHeight}
                                onReady={(editor) => {
                                    // Adding custom upload adapter when editor is ready
                                    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new MyUploadAdapter(loader);
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </StyledModal>
    );
};

export default TaskModal;
