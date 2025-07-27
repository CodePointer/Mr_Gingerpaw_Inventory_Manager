## v0.0.3 - 2025-07-27

1. 修改了backend的debug模式。方便进行后端的debug流程。
2. 数据库增加pgVector扩展：
    - 修改了Docker-compose.yml，同时设置了远程的仓库。
    - 修改了seed_data.py文件来开启相应的pgVector。
    - 修改了`backend/app/models/item.py`与`backend/app/models/tag.py`，增加了相应的Vector字段。
3. 新增LLM模块：
    - 修改了requirements.txt，增加了OpenAI包的依赖。
    - routers与schemas增加了admin入口，用于临时测试。
    - .text模块增加了相应的测试入口。
    - 创建了`backend/app/core/ai_client.py`，用于提供llm服务。

TODO:
- 前端增加相应的入口。
- 增加user、family的限制，修改`ai_client.py - query`部分的内容。
- 使用异步操作完成AI的query。


## v0.0.2 - 2025-07-19

1. 草稿逻辑修改。使用 前端缓存 + 统一提交至后端 方式减少调用频率，适用于Function-based Service。
2. 草稿进行了拆分——分别处理更新、删除、新增和数量修改。
3. 修改了Item、Tag的管理逻辑。现在统一使用string类型的id字段管理。临时创建的新item/tag会以'tmpID'开始。
4. 重写了DraftContext，将功能拆分。
5. 重新调整了ItemModal和TagModal的逻辑，为他们单独创建了hook，简化了Screen界面的运行逻辑。
6. 重新梳理了翻译文件结构——现在以不同功能划分了不同的json文件，方便管理。
7. 更加明确的功能划分——Screen界面级处理所有的数据逻辑，而组件仅负责UI渲染功能。

---

1. Draft logic updated: Uses frontend caching + unified submission to backend to reduce call frequency, suitable for Function-based Service.
2. Drafts are now split—handling updates, deletions, additions, and quantity changes separately.
3. Modified Item and Tag management logic: now consistently uses string-type `id` fields. Newly created items/tags use IDs starting with 'tmpID'.
4. DraftContext refactored and split into separate functionalities.
5. ItemModal and TagModal logic restructured; dedicated hooks created for each to simplify Screen component logic.
6. Translation file structure reorganized—now divided by functionality into separate JSON files for easier management.
7. Clearer functional separation—Screen components handle all data logic, while UI components focus solely on rendering.

## v0.0.1 - 2025-06-08

- 初版上线
- 实现了登录、注册、密码找回功能
- 实现了多家庭、多用户支持
- 实现物品的查看、编辑、删除机制
- 实现草稿机制，本地草稿保存
- 实现了多语言支持

- Initial release
- Implemented login, registration, and password recovery features
- Implemented multi-family and multi-user support
- Implemented item viewing, editing, and deletion mechanisms
- Implemented draft mechanism with local draft saving
- Implemented multi-language support
