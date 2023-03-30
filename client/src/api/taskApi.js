import axiosClient from "./axiosClient";

const taskApi = {
    // Create a new task for the board with the given ID and the given parameters
    create: (boardId, params) => axiosClient.post(`boards/${boardId}/tasks`, params),

    // Update the position of the tasks in the board with the given ID using the given parameters
    updatePosition: (boardId, params) => axiosClient.put(`boards/${boardId}/tasks/update-position`, params),

    // Delete the task with the given ID from the board with the given ID
    delete: (boardId, taskId) => axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),

    // Update the task with the given ID in the board with the given ID using the given parameters
    update: (boardId, taskId, params) => axiosClient.put(`boards/${boardId}/tasks/${taskId}`, params),
};

export default taskApi;
