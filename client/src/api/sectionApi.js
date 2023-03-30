import axiosClient from "./axiosClient";

const sectionApi = {
    // Create a new section in a board with the given board ID
    create: (boardId) => axiosClient.post(`boards/${boardId}/sections`),
    // Update an existing section in a board with the given board ID and section ID
    update: (boardId, sectionId, params) => axiosClient.put(`boards/${boardId}/sections/${sectionId}`, params),
    // Delete an existing section in a board with the given board ID and section ID
    delete: (boardId, sectionId) => axiosClient.delete(`boards/${boardId}/sections/${sectionId}`),
};

export default sectionApi;
