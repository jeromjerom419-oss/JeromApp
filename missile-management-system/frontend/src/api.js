import axios from 'axios';

const API_URL = 'http://localhost:5000/api/missiles';

export const getMissiles = () => axios.get(API_URL);
export const getMissile = (id) => axios.get(`${API_URL}/${id}`);
export const createMissile = (data) => axios.post(API_URL, data);
export const updateMissile = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteMissile = (id) => axios.delete(`${API_URL}/${id}`);
