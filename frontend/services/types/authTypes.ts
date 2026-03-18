export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
}

// 用户登录
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
}

// 密保问题
export interface ResetQuestionRequest {
    email: string;
}

// 验证问题答案
export interface VerifyAnswerRequest {
    email: string;
    securityAnswer: string;
}

// 密码重置
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

// // 用户信息
// export interface UserOut {
//     id: number;
//     username: string;
//     email: string;
//     phoneNumber?: string;
//     role: 'adult' | 'child';
//     isActive: boolean;
//     notes?: string;
// }
