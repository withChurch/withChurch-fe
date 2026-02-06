import api from "./axios";

// 전체 첨부파일 조회
export const getAllAttachments = () => api.get("/attachments");

export const uploadFiles = (files) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("files", file); 
  });

  return api.post("/attachments/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 첨부파일 수정
export const updateAttachment = (attachmentId, data) => 
  api.patch(`/attachments/${attachmentId}`, data);

// 첨부파일 삭제
export const deleteAttachment = (attachmentId) => 
  api.delete(`/attachments/${attachmentId}`);

// 첨부파일 다운로드
export const downloadAttachment = async (attachmentId, fileName) => {
  try {
    const response = await api.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
    
    // Blob URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'download'); // 파일명 지정
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    throw error;
  }
};