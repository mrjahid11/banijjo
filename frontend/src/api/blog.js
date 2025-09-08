import client from "./client";

export const listBlogs = () => client.get("/blog/all").then(r => r.data);
export const listMyBlogs = () => client.get("/blog/mine").then(r => r.data);

// Let axios set the correct multipart boundary; do not force Content-Type
export const createBlog = (formData) => client.post("/blog/create", formData).then(r => r.data);

export const photoUrl = (id) => `${client.defaults.baseURL}/blog/${id}/photo`;
export const documentUrl = (id) => `${client.defaults.baseURL}/blog/${id}/document`;
