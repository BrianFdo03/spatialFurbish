import { axiosInstance } from "@/lib/axios";

export interface SceneObjectPayload {
  sceneObjectId?: string;
  productId?: string;
  position?: { x: number; y: number };
  rotation?: number;
  color?: string;
  texture?: string;
  isPlaced?: boolean;
  roomDesignId?: string;
}

export const sceneObjectAPI = {
  bulkAdd: (designId: string, objects: SceneObjectPayload[]) =>
    axiosInstance.post(`/sceneObject/${designId}/objects`, { objects }),

  addSingle: (designId: string, object: SceneObjectPayload) =>
    axiosInstance.post(`/sceneObject/${designId}/object`, object),

  update: (
    designId: string,
    objectId: string,
    data: Partial<SceneObjectPayload>,
  ) => axiosInstance.put(`/sceneObject/${designId}/object/${objectId}`, data),

  delete: (designId: string, objectId: string) =>
    axiosInstance.delete(`/sceneObject/${designId}/objects/${objectId}`),
};
