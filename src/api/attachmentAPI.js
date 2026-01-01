import api from "./axios";

// 전체 첨부파일 조회
export const getAllAttachments = () => api.get("/attachments");

// 파일 업로드 (multipart/form-data)
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/attachments/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 여러 파일 업로드
export const uploadFiles = async (files) => {
  const uploadPromises = Array.from(files).map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
};

// 첨부파일 수정
export const updateAttachment = (attachmentId, data) => 
  api.patch(`/attachments/${attachmentId}`, data);

// 첨부파일 삭제
export const deleteAttachment = (attachmentId) => 
  api.delete(`/attachments/${attachmentId}`);

// 첨부파일 다운로드
export const downloadAttachment = (attachmentId) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";
  return `${baseURL}/api/attachments/${attachmentId}/download`;
};

