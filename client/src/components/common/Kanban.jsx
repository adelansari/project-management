import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";

// Set a timer and a timeout period
let timer;
const timeout = 500;

const Kanban = (props) => {
  const boardId = props.boardId;
  // Set initial state for data and selected task
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  // Update data when props.data changes
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // Handle dragging and dropping tasks between columns
  const onDragEnd = async ({ source, destination }) => {
    // If there is no destination, return
    if (!destination) return;
    // Find the source and destination columns and their indexes in the data array
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    // Get the IDs of the source and destination sections
    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    // Create copies of the tasks arrays for the source and destination columns
    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    // If the source and destination columns are different
    if (source.droppableId !== destination.droppableId) {
      // Remove the task from the source column
      const [removed] = sourceTasks.splice(source.index, 1);
      // Insert the task into the destination column
      destinationTasks.splice(destination.index, 0, removed);
      // Update the tasks arrays for the source and destination columns in the data array
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      // If the source and destination columns are the same
      // Remove the task from the destination column
      const [removed] = destinationTasks.splice(source.index, 1);
      // Insert the task back into the destination column at the new index
      destinationTasks.splice(destination.index, 0, removed);
      // Update the tasks array for the destination column in the data array
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      // Update the position of the task in the database
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      // Update the data state with the new data
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  // Create a new section
  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      // Add the new section to the data array
      setData([...data, section]);
    } catch (err) {
      alert(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      // Delete the section from the board
      await sectionApi.delete(boardId, sectionId);
      // Filter out the deleted section from the data
      const newData = [...data].filter((e) => e.id !== sectionId);
      // Update the data with the filtered data
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };
  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer);
    // Get the new title from the event
    const newTitle = e.target.value;
    // Create a copy of the data
    const newData = [...data];
    // Find the index of the section to be updated
    const index = newData.findIndex((e) => e.id === sectionId);
    // Update the title of the section
    newData[index].title = newTitle;
    // Update the data with the modified data
    setData(newData);
    // Set a timeout to update the section title on the board
    timer = setTimeout(async () => {
      try {
        // Update the section title on the board
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };
  const createTask = async (sectionId) => {
    try {
      // Create a task in the given section
      const task = await taskApi.create(boardId, { sectionId });
      // Create a copy of the data
      const newData = [...data];
      // Find the index of the section
      const index = newData.findIndex((e) => e.id === sectionId);
      // Add the created task to the section
      newData[index].tasks.unshift(task);
      // Update the data with the modified data
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };
  const onUpdateTask = (task) => {
    // Create a copy of the data
    const newData = [...data];
    // Find the index of the section
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    // Find the index of the task
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    // Update the task in the data
    newData[sectionIndex].tasks[taskIndex] = task;
    // Update the data with the modified data
    setData(newData);
  };
  const onDeleteTask = (task) => {
    // Create a copy of the data
    const newData = [...data];
    // Find the index of the section
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    // Find the index of the task
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    // Remove the task from the data
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    // Update the data with the modified data
    setData(newData);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={createSection}>Add section</Button>
        <Typography variant="body2" fontWeight="700">
          {data.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "calc(100vw - 421px)",
            overflowX: "auto",
            height: "60vh",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {data.map((section) => (
            <div key={section.id} style={{ width: "300px" }}>
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        placeholder="Untitled"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          // Remove padding from input
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          // Remove border from input
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1rem",
                            fontWeight: "700",
                            // Add transition for box-shadow and background-color
                            transition:
                              "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
                          },
                          // Add styles for when the input is focused
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            boxShadow: "0 0 15px #03a9f4",
                            backgroundColor: "#f5f5f5",
                            color: "black",
                          },
                        }}
                      />
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": {
                            color: "green",
                            boxShadow: "0 0 15px green",
                          },
                        }}
                        onClick={() => createTask(section.id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": {
                            color: "red",
                            boxShadow: "0 0 15px red",
                          },
                        }}
                        onClick={() => deleteSection(section.id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                    {/* tasks */}
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: "10px",
                              marginBottom: "10px",
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                              boxShadow: snapshot.isDragging
                                ? "0 0 15px #03a9f4"
                                : "none",
                              backgroundColor: snapshot.isDragging
                                ? "#03a9f4"
                                : "inherit",
                              color: snapshot.isDragging ? "#fff" : "inherit",
                              ":hover": {
                                boxShadow: "0 0 15px #03a9f4",
                                backgroundColor: "#03a9f4",
                                color: "#fff",
                              },
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography>
                              {task.title === "" ? "Untitled" : task.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
};

export default Kanban;
