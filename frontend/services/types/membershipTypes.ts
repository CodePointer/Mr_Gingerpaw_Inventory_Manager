// services/types/userTypes.ts

export interface MembershipTokenRequest {
  familyId: number;
  tokenRole: string;
}


export interface MembershipToken {
  token: string;
}


export interface MembershipOut {
  userId: number;
  familyId: number;
  role: string;  
}


export interface MembershipUpdate {
  userId: number;
  familyId: number;
  role: string;
}


export interface LocationOut {
  locationName: string;
  itemCount: number;
}
