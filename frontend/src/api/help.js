import client from "./client";

export const createHelpRequest = async ({ companyId, issueType, description }) => {
  const { data } = await client.post("/help/request", { companyId, issueType, description });
  return data;
};

export const myHelpRequests = async () => {
  const { data } = await client.get("/help/me");
  return data;
};

export const adminHelpDashboard = async () => {
  const { data } = await client.get("/help/admin");
  return data;
};

export const updateHelpStatus = async (id, status) => {
  const { data } = await client.post(`/help/admin/${id}/status`, { status });
  return data;
};
