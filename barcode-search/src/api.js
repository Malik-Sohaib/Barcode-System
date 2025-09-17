import axios from "axios";

// Backend ka URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

// ✅ Users API
export const loginUser = (data) => axios.post(`${BASE_URL}/api/login`, data);
export const getUsers = () => axios.get(`${BASE_URL}/api/users`);
export const createUser = (data) => axios.post(`${BASE_URL}/api/users`, data);
export const deleteUser = (id) => axios.delete(`${BASE_URL}/api/users/${id}`);

// ✅ Products API
export const getProducts = (params = {}) => axios.get(`${BASE_URL}/api/products`, { params });
export const addProduct = (data) => axios.post(`${BASE_URL}/api/add-product`, data);
export const deleteProduct = (id, role) => axios.delete(`${BASE_URL}/api/product/${id}?role=${role}`);
