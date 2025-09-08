import client from "./client";

export const listCompanies = async () => (await client.get("/market/companies")).data;
export const listOfferings = async () => (await client.get("/market/offerings")).data;
export const dashboardOfferings = async () => (await client.get("/market/dashboard/offerings")).data;

// Courses API
export const listCourses = async () => {
  const res = await client.get('/courses');
  return res.data;
}
export const getCourse = async (id) => {
  const res = await client.get(`/courses/${id}`);
  return res.data;
}
export const enrollCourse = async (id) => {
  const res = await client.post(`/courses/${id}/enroll`);
  return res.data;
}
export const unenrollCourse = async (id) => {
  const res = await client.post(`/courses/${id}/unenroll`);
  return res.data;
}
export const myEnrollments = async () => {
  const res = await client.get('/courses/me');
  return res.data;
}
export const adminCreateCourse = async (payload) => {
  const res = await client.post('/courses/admin/create', payload);
  return res.data;
}
export const adminMyCourses = async () => {
  const res = await client.get('/courses/admin/mine');
  return res.data;
}
export const adminUpdateCourse = async (id, payload) => {
  const res = await client.put(`/courses/admin/${id}`, payload);
  return res.data;
}
export const adminDeleteCourse = async (id) => {
  const res = await client.delete(`/courses/admin/${id}`);
  return res.data;
}

// Broker APIs
export const brokerOverview = async (params = {}) => {
  const res = await client.get('/brokers/overview', { params });
  return res.data;
}
export const brokerRecentTrades = async (page = 0, size = 20) => {
  const res = await client.get('/brokers/trades/recent', { params: { page, size } });
  return res.data;
}
export const buyShares = async (offeringId, quantity) => (await client.post("/market/buy", { offeringId, quantity })).data;

// Admin
export const adminCreateCompany = async ({ symbol, name, description }) => (
  await client.post("/market/admin/company", { symbol, name, description })
).data;
export const adminCreateOffer = async ({ symbol, shares, price }) => (
  await client.post("/market/admin/offer", { symbol, shares, price })
).data;
export const adminMonitor = async () => (await client.get("/market/admin/monitor")).data;

// Peer-to-peer holdings
export const myHoldings = async () => (await client.get("/market/my/holdings")).data;
export const listHoldingForSale = async (holdingId, price) => (
  await client.post(`/market/my/holdings/${holdingId}/sell`, { price })
).data;
export const publicListings = async () => (await client.get("/market/listings")).data;
export const buyFromListing = async (holdingId, quantity) => (
  await client.post(`/market/listings/${holdingId}/buy`, { quantity })
).data;

// Chat
export const myChatCompanies = async () => (await client.get("/chat/companies")).data;
export const getMessages = async (companyId) => (await client.get(`/chat/${companyId}/messages`)).data;
export const sendMessage = async (companyId, content, toUserId) => (
  await client.post(`/chat/${companyId}/messages`, toUserId ? { content, toUserId } : { content })
).data;
