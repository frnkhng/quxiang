import apiClient from './client'

export interface PresignedUpload {
  uploadUrl: string
  fileUrl: string
  key: string
}

export const uploadsApi = {
  async getPresignedUrl(filename: string, contentType: string): Promise<PresignedUpload> {
    const response = await apiClient.post('/uploads/presign', {
      filename,
      contentType,
    })
    return response.data
  },

  async uploadFile(file: File): Promise<string> {
    const presigned = await this.getPresignedUrl(file.name, file.type)
    
    await fetch(presigned.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    return presigned.fileUrl
  },
}
