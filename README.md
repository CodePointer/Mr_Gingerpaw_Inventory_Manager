# the_great_orange

## ✅ 前端项目 TODO

- [ ] 实现自动登录功能：
  - 登录成功后将 token 存入本地（如 AsyncStorage）
  - App 再次启动时自动读取本地 token
  - 若 token 有效则直接跳转家庭页，跳过登录界面

## ✅ 后端项目 TODO

- [ ] Alembic 中添加 item 的唯一性约束（包括 owner_id）
- [ ] 接口展示列表化与编辑限制（前端 UI 要采用明显排仓）
- [ ] 支持 item 合并设计（冲突时通过 UI 确认合并）
- [ ] 新增 item 形式用于更名或切换 unit（删除旧 item + 创建新物品）
- [ ] `POST /items/transfer/` 迁移接口（正在开发中）
- [ ] 智能输入解析（调用 OpenAI 接口，解析自然语言为结构化物品）
