// 标签创建请求
export interface TagCreate {
  name: string;
  familyId?: number;
}

// 标签信息
export interface TagOut {
  id: string;
  name: string;
  familyId?: number;
}

// 标签更新请求
export interface TagUpdate {
  name?: string;
}

export interface TagStatus {
  status: string;
  code: number;
  tagId: string;
  message?: string;
}