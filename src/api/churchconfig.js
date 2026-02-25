import api from "./axios";

export const getChurchConfig = async (domain) => {
  const res = await api.get("/church/config", { params: { domain } });
  return res.data.data;
};