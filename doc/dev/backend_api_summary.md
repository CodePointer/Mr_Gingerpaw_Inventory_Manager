# Backend API Summary 20250420

以下为后端的接口。

## Auth 相关

| 路径                     | 方法     | 说明                          |  状态  |
| ---------------------- | ------ | -------------------------- | -- |
| `/auth/register`       | `POST` | 用户注册                       | 已实现 |
| `/auth/login`          | `POST` | 用户登录，返回 Bearer token       | 已实现 |
| `/auth/reset-question`  | `POST` | 找回密码：提供邮箱，返回对应验证问题         | 已实现 |
| `/auth/verify-answer`  | `POST` | 用户提交验证问题的答案，返回 reset token | 已实现 |
| `/auth/reset-password` | `POST`  | 提交 reset token + 新密码，完成重置  | 已实现 |

---

## User 相关

| 路径                      | 方法    | 说明                    | 状态 |
| ----------------------- | ----- | --------------------- | -- |
| `/users/me`             | `GET` | 获取当前登录用户信息            | 已实现 |
| `/users/me/families`    | `GET` | 获取用户所属的家庭列表           | 已实现 |
| `/users/me/memberships` | `GET` | 获取 Membership 信息（含角色） | 已实现 |
| `/users/me/update`      | `PUT` | 更新用户个人信息 | 已实现 |
| `/users/me/password` | `PATCH` | 更新用户密码（需验证旧密码） | 已实现 |
| `/users/me/reset-question` | `PUT` | 更新用户个人的security question | 已实现 |
| `/users/me/deactivate` | `POST` | 注销账号（逻辑删除） | 已实现 |

---

## Membership 相关

| 路径 | 方法 | 说明 | 状态 |
| -- | -- | -- | -- |
| `/memberships/invite` | `POST` | 生成一个家庭的邀请码（从family迁移） | 已实现 |
| `/memberships/` | `POST` | 用户使用邀请码加入家庭 | 已实现 |
| `/memberships/by-key` | `DELETE` | 用户退出家庭 | 已实现 |
| `/memberships/by-key` | `PATCH` | 修改角色权限 | 已实现 |

---

## Family 相关

| 路径                       | 方法    | 说明             | 状态 |
| ------------------------ | ----- | -------------- | -- |
| `/families/{id}`         | `GET` | 获取家庭详情         | 已实现 | 
| `/families/{id}/members` | `GET` | 查看该家庭下的成员      | 已实现 |
| `/families/{id}/locations` | `GET` | 查看该家庭下的所有物品的位置  | 已实现 |
| `/families/` | `POST` | 创建新家庭 | 已实现 |
| `/families/{id}` | `PUT` | 修改家庭信息 | 已实现 |
| `/families/{id}` | `DELETE` | 删除家庭 | 已实现 |

---

## Item 相关

- 草稿由前端管理，后端不具备草稿。status项删除。
- 唯一字段暂时不支持修改。

| 路径                    | 方法      | 说明                  |  状态 |
| --------------------- | ------- | ------------------- | ----- |
| `/families/{fid}/items/`  | `POST` | 创建物品。传入物品的基本信息。 | 已实现 |
| `/families/{fid}/items/batch`  | `POST` | 批量创建物品。 | TODO，待实现 |
| `/families/{fid}/items?tags=早餐&location=xx` | `GET`   | 查询符合标签的物品。可以通过location和tags筛选  | 已实现 |
| `/families/{fid}/items/check-needed` | `GET`   | 获取当前用户家庭中需要检查的物品 |  已实现 |
| `/families/{fid}/items/{id}/check`   | `PUT`   | 标记物品为已检查（更新时间）      |  已实现 |
| `/families/{fid}/items/bulk-check`   | `PUT`   | 标记物品为已检查（更新时间）      |  已实现 |
| `/families/{fid}/items/bulk-add-tags` | `POST` | 批量添加标签 | 已实现 |
| `/families/{fid}/items/{id}`    | `PATCH` | 更新某物品的非主要项。 | 已实现 |
| `/families/{fid}/items/bulk-update`    | `PATCH` | 更新多个物品的非主要项。 | TODO，待实现 |
| `/families/{fid}/items/bulk-delete` | `POST` | 批量逻辑删除物品 | 已实现 |
| `/families/{fid}/items/{id}` | `DELETE` | 删除某物品（逻辑删除） | 已实现 |

---

## Tag 相关

| 路径           | 方法       | 说明                   | 状态 | 
| ------------ | -------- | -------------------- | -- |
| `/families/{fid}/tags/`    | `GET` | 获取该家庭下所有标签 | 已实现 |
| `/families/{fid}/tags/`     | `POST`   | 创建新标签                | 已实现 |
| `/families/{fid}/tags/{id}` | `PUT`    | 修改标签名称               | 已实现 |
| `/families/{fid}/tags/{id}` | `DELETE` | 删除标签（建议自动解除 item 关联） | 已实现 |

---

## Transaction 相关

| 路径 | 方法 | 说明 | 状态 |
| -- | -- | -- | -- |
| `/families/{fid}/transactions/` | `POST` | 创建新的交易 | 已实现 |
| `/families/{fid}/transactions/batch` | `POST` | 创建多条交易 | 已实现 |
| `/families/{fid}/transactions/{id}` | `GET` | 查看某一条交易 | 已实现 |
| `/families/{fid}/transactions/{id}` | `PUT` | 修改交易注释 | 已实现 |
| `/families/{fid}/transactions/{id}` | `DELETE` | 取消交易 | 已实现 |

---
