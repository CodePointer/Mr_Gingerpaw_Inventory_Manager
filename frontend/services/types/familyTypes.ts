// 创建家庭请求
export interface FamilyCreate {
    name: string;
    notes?: string;
}

// 家庭信息
export interface FamilyOut {
    id: number;
    name: string;
    notes?: string;
    role?: 'adult' | 'child';
    isActive?: boolean;
}

// 更新家庭信息
export interface FamilyUpdate {
    name?: string;
    notes?: string;
}

