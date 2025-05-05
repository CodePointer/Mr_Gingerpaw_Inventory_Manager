# Backend

✅ 原因解析
路由	用途	是否需要 Token
/auth/login	用户登录并获取 token	❌ 无需 token（因为尚未登录）
/auth/register	创建新用户	❌ 无需 token（首次注册）


✅ 推荐设计思路：以资源维度重新组织 API
🧱 接口结构推荐如下：
1️⃣ 用户接口 /users
GET /users/me → 返回当前用户信息

GET /users/me/families → 我所属的家庭（由 membership 推导）

✅ 可保留 /users/me 路由，但仅限用户本身属性（账号中心）

2️⃣ 家庭接口 /families
GET /families/{id}/items → 获取该家庭下所有物品

GET /families/{id}/tags → 获取该家庭下所有物品出现过的标签（辅助 tag 筛选）

GET /families/{id}/members → 查看成员列表

3️⃣ 物品接口 /items
GET /items?family_id=1&tags=早餐 → 可接受 family_id 作为明确上下文

PATCH /items/{id}/tags → 设置 item 的标签（已鉴权，需验证该用户属于 item 的家庭）

4️⃣ membership 管理 /memberships
查询当前用户的 membership，用于家庭切换时 UI 判断



# Frontend

### ✅ 阶段 1：登录后自动获取用户信息 + 所属家庭列表
模块	接口	前端用途
当前用户信息	GET /users/me	登录成功后加载用户名、ID 等
所属家庭列表	GET /families/	登录后加载用户所属的家庭列表（后端可能需改为 GET /my-families）
你需要在 AuthProvider 或 MeScreen 中完成这部分数据的拉取与家庭切换逻辑状态保存（如用全局 FamilyContext）

✅ 阶段 2：多家庭切换逻辑对接
每次进入物品页 /items、提交 /entry、加载提醒页 /reminders 等操作，都需要附带当前选中的 family_id 参数

建议使用全局状态（如 FamilyContext）统一管理当前选择的家庭，并提供更新方法

✅ 阶段 3：物品页（/items）接入真实数据
功能	接口	参数	实现方式
获取物品列表	GET /items/	family_id, tags[]（可选）	使用 axios.get 请求并渲染
tag 筛选	GET /tags/	—	加载所有标签作为筛选项
搜索框	前端本地过滤	—	基于物品名称模糊匹配
编辑物品	PUT /items/{id}	可更新 location, tags 等	设计弹出层或内联编辑卡片
✅ 阶段 4：录入页（/entry）与后端对接
操作	接口	说明
创建物品	POST /items/	添加表单字段：提醒时间（映射为 check_interval_days）与 tags（数组）
获取 tag 列表	GET /tags/	提供 tag 勾选选项
提交后操作	—	将新物品添加到本地物品列表 / 页面跳转提醒 ✅
✅ 阶段 5（后续）：提醒页 /reminders 对接
功能	接口	说明
获取提醒列表	GET /items/check-needed	显示“需要检查”的物品
标记为已检查	PUT /items/{id}/check	修改提醒状态
删除物品	DELETE /items/{id}	提供按钮操作