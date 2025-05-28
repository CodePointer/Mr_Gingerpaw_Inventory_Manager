import api from "@/services/utils/axiosInstance";
import { 
  MembershipTokenRequest,
  MembershipToken,
  MembershipOut, 
  MembershipUpdate 
} from "@/services/types";


export const createInviteToken = async (data: MembershipTokenRequest): Promise<MembershipToken> => {
    const response = await api.post("/memberships/invite", data);
    return response.data;
};


export const joinWithToken = async (data: MembershipToken): Promise<MembershipOut> => {
    const response = await api.post("/memberships/", data);
    return response.data;
};


export const deleteMembership = async (data: MembershipOut): Promise<MembershipOut> => {
  const response = await api.delete("/memberships/by-key", { data: data });
  return response.data;
};


export const updateMembership = async (data: MembershipUpdate): Promise<MembershipOut> => {
    const response = await api.patch("/memberships/by-key", data);
    return response.data;
};
