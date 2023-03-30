import axiosClient from "./axiosClient";

const boardApi = {
    // Method to create a new board
    create: () => axiosClient.post("boards"),
    // Method to get all boards
    getAll: () => axiosClient.get("boards"),
    // Method to update the position of a board
    updatePositoin: (params) => axiosClient.put("boards", params),
    // Method to get a single board by ID
    getOne: (id) => axiosClient.get(`boards/${id}`),
    // Method to delete a board by ID
    delete: (id) => axiosClient.delete(`boards/${id}`),
    // Method to update a board by ID
    update: (id, params) => axiosClient.put(`boards/${id}`, params),
    // Method to get all favourite boards
    getFavourites: () => axiosClient.get("boards/favourites"),
    // Method to update the position of a favourite board
    updateFavouritePosition: (params) => axiosClient.put("boards/favourites", params),
};

export default boardApi;
