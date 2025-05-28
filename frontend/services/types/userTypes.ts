// services/types/userTypes.ts

// 用户基本信息
export interface UserOut {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string;
    securityQuestion?: string;
    notes?: string;
    role?: "adult" | "child";
    isActive: boolean;
}

// 更新用户基本信息
export interface UserUpdateInfoRequest {
    username?: string;
    email?: string;
    phoneNumber?: string;
    notes?: string;
}

// 更新用户密码
export interface UserUpdatePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

// 更新密保问题
export interface UserUpdateResetQuestionRequest {
    password: string;
    securityQuestion: string;
    securityAnswer: string;
}

// 用户注销
export interface UserDelete {
    reason: string;
    confirmed: boolean;
}
