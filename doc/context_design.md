# 前端 Context 与后端 API 对应关系

以下是前端各 Context 组件与后端 API 的对应关系。此表格包含 `AuthContext`、`FamilyContext`、`ItemsContext`、`TagContext`、`MembershipContext` 和 `UserContext`，确保前后端数据交互的一致性。

| Context                | 前端 Context 方法            | 对应后端 API            | 请求方法     | 路径                                            |
| ---------------------- | ------------------------ | ------------------- | -------- | --------------------------------------------- |
| **AuthContext**        | `login`                  | 登录                  | `POST`   | `/auth/login`                                 |
|                        | `register`               | 注册                  | `POST`   | `/auth/register`                              |
|                        | `getResetQuestion`       | 获取密保问题              | `POST`   | `/auth/reset-question`                        |
|                        | `verifyAnswer`           | 验证密保答案              | `POST`   | `/auth/verify-answer`                         |
|                        | `resetPassword`          | 重置密码                | `PATCH`  | `/auth/reset-password`                        |
|                        | `deactivate`             | 注销账号                | `POST`   | `/users/me/deactivate`                        |
| **UserContext**        | `getUserInfo`            | 获取当前用户信息            | `GET`    | `/users/me`                                   |
|                        | `getUserFamilies`        | 获取用户所属家庭            | `GET`    | `/users/me/families`                          |
|                        | `getUserMemberships`     | 获取用户的 Membership 信息 | `GET`    | `/users/me/memberships`                       |
|                        | `updateUserInfo`         | 更新用户信息              | `PUT`    | `/users/me/update`                            |
|                        | `updatePassword`         | 更新用户密码              | `PATCH`  | `/users/me/password`                          |
|                        | `updateResetQuestion`    | 更新密保问题              | `PUT`    | `/users/me/reset-question`                    |
| **FamilyContext**      | `getFamilyDetails`       | 获取家庭详情              | `GET`    | `/families/{family_id}`                       |
|                        | `createFamily`           | 创建家庭                | `POST`   | `/families/`                                  |
|                        | `updateFamily`           | 更新家庭信息              | `PUT`    | `/families/{family_id}`                       |
|                        | `deleteFamily`           | 删除家庭                | `DELETE` | `/families/{family_id}`                       |
|                        | `getFamilyMembers`       | 查看家庭成员              | `GET`    | `/families/{family_id}/members`               |
|                        | `getFamilyLocations`     | 查看家庭物品位置            | `GET`    | `/families/{family_id}/locations`             |
| **ItemsContext**       | `getItems`               | 获取物品列表              | `GET`    | `/families/{family_id}/items/`                |
|                        | `createItem`             | 创建物品                | `POST`   | `/families/{family_id}/items/`                |
|                        | `updateItem`             | 更新物品                | `PUT`    | `/families/{family_id}/items/{item_id}`       |
|                        | `removeItem`             | 删除物品                | `DELETE` | `/families/{family_id}/items/{item_id}`       |
|                        | `getItemsNeedingCheck`   | 获取需要检查的物品           | `GET`    | `/families/{family_id}/items/check-needed`    |
|                        | `markItemsChecked`       | 批量标记物品为已检查          | `PATCH`  | `/families/{family_id}/items/bulk-check`      |
|                        | `bulkAddTags`            | 批量添加标签              | `PATCH`  | `/families/{family_id}/items/bulk-add-tags`   |
|                        | `updateLastCheck`        | 更新物品的最后检查时间         | `PATCH`  | `/families/{family_id}/items/{item_id}/check` |
| **MembershipContext**  | `createToken`            | 创建邀请码               | `POST`   | `/memberships/invite`                         |
|                        | `joinWithToken`          | 通过邀请码加入家庭           | `POST`   | `/memberships/`                               |
|                        | `deleteMembership`       | 删除成员                | `DELETE` | `/memberships/by-key`                         |
|                        | `updateMembership`       | 更新成员角色              | `PATCH`  | `/memberships/by-key`                         |
| **TransactionContext** | `createTransaction`      | 创建交易                | `POST`   | `/families/{family_id}/transactions/`         |
|                        | `createBatchTransaction` | 批量创建交易              | `POST`   | `/families/{family_id}/transactions/batch`    |
|                        | `getTransaction`         | 获取单条交易详情            | `GET`    | `/families/{family_id}/transactions/{tx_id}`  |
|                        | `updateTransaction`      | 更新交易                | `PUT`    | `/families/{family_id}/transactions/{tx_id}`  |
|                        | `deleteTransaction`      | 删除交易                | `DELETE` | `/families/{family_id}/transactions/{tx_id}`  |
