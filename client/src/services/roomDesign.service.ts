import { axiosInstance } from "@/lib/axios";
import type { SceneObjectPayload } from "./sceneObject.service";

export interface CreateRoomDesignPayload {
  name: string;
  userId: string;
  roomType: string;
  sceneObjects?: SceneObjectPayload[];
}

export interface UpdateRoomDesignPayload {
  name?: string;
  roomType?: string;
  updatedSceneObjects?: SceneObjectPayload[];
}

export const roomDesignAPI = {
  create: (data: CreateRoomDesignPayload) =>
    axiosInstance.post("/roomDesign", data),

  getUserDesigns: () => axiosInstance.get("/roomDesign"),

  getById: (id: string) => axiosInstance.get(`/roomDesign/${id}`),

  update: (id: string, data: UpdateRoomDesignPayload) =>
    axiosInstance.put(`/roomDesign/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`/roomDesign/${id}`),
};
