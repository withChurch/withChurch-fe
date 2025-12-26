import axios from "./axiosInstance";

export const getBoards = async () => {
  const res = await axios.get("/boards");
  return res.data.data; // 배열
};
