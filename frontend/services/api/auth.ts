import api from "../utils/axiosInstance";
import { 
    LoginRequest, LoginResponse, RegisterRequest, 
    UserOut, ResetQuestionRequest, 
    VerifyAnswerRequest, ResetPasswordRequest 
} from "../types";

// 用户登录
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
};

// 用户注册
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
};

// 找回密码：获取密保问题
export const getResetQuestion = async (data: ResetQuestionRequest): Promise<{ securityQuestion: string }> => {
    const response = await api.post("/auth/reset-question", data);
    return response.data;
};

// 验证密保问题答案
export const verifyAnswer = async (data: VerifyAnswerRequest): Promise<{ token: string }> => {
    const response = await api.post("/auth/verify-answer", data);
    return response.data;
};

// 密码重置
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.patch("/auth/reset-password", data);
    return response.data;
};
