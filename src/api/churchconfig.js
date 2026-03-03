import api, { resolveChurchDomain } from "./axios";

export const getChurchConfig = async (domain = resolveChurchDomain()) => {
  const res = await api.get("/church/config", { params: { domain } });
  return res.data.data;
};