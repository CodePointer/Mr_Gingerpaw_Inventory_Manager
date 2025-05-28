// 统一的批量响应结构
export interface BulkResponseOut<T> {
    success: T[];
    failed: T[];
}

// 验证错误信息
export interface ValidationError {
    loc: string[];
    msg: string;
    type: string;
}

// 通用的分页请求
export interface PaginatedRequest {
    page: number;
    pageSize: number;
}
