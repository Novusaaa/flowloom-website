# API 模型配置指南

适用：Flowloom 3.1。正式工作台：[flowloom.cc](https://flowloom.cc/)。

默认本地演示引擎无需密钥。若需要真实大模型，由工作空间 Owner / Admin 在“管理后台 → 系统设置”配置 **OpenAI-compatible / OpenAI 兼容接口**。配置只对当前工作空间生效。

## 准备三项信息

| 信息 | 填写方法 |
| --- | --- |
| API Base URL | 服务商提供的 Chat Completions 兼容 API 地址，不是产品官网或控制台地址 |
| Model | 服务商允许你调用的精确模型 ID |
| API key | 在后台密钥框输入自己的服务商密钥，不要提交到 GitHub 或公开截图 |

例如 `https://api.your-provider.example/v1` 与 `your-model-id` **只是占位示例，不能直接调用**。填写 API 基础地址后，Flowloom 会追加 `/chat/completions`；如果已填写完整的该 endpoint，不会重复追加。

地址不能含 `?key=...`、用户名、密码、query 或 fragment。公网工作空间仅允许公网 HTTPS，不允许 localhost / 内网代理地址。仅支持原生 Messages、Responses 或特殊认证头的服务，不能直接当作兼容接口填写。

## 配置步骤

1. 选择 OpenAI 兼容执行模式，填写地址、模型 ID 和密钥。
2. 按服务商要求选择高级参数：最大输出默认 2048 token，允许 16–8192；token 字段可选 `max_tokens` 或 `max_completion_tokens`；不接受 temperature 的模型关闭“发送 temperature”。
3. 点击“测试连接”。可以测试未保存的表单，不会先覆盖原配置。测试会消耗极小量真实模型用量。
4. 测试通过后保存，再在代理或工作流模型节点发一个短请求，确认实际结果。

部分推理模型可能无法在当前最小测试的 16 token 预算内返回可见文本。遇到空输出应核对兼容性与推理预算，不能只认定 key 错了；必要时把错误 code / requestId 提供给管理员。

## 密钥与常见问题

- 密钥由服务端加密保存，页面不会回显原 key。更换接口 origin 后，旧密钥不会自动发给新地址，需要重新填写正确供应商的 key。
- 401：检查 key、账号和授权；404 / HTML：检查 API 地址；model not found：检查精确模型 ID。
- 不支持 `max_tokens`：按服务商要求选择 `max_completion_tokens`；不支持 temperature：关闭该参数。
- 429：可能是本站并发 / 排队满，也可能是服务商限流或额度不足；超时则检查服务器到供应商的网络与推理时间。
- 保存配置不等于所有模型功能均可用。支持范围仍需实际服务验证，当前不是模型逐 token 流式输出。
- 接通大模型不会自动授权 Slack、Notion 等外部应用，当前这些动作仍是模拟。

模型服务商可能按调用计费，重试也可能产生用量；价格与可用模型以其控制台为准。不要为了测试关闭证书或网络安全检查。

产品联系邮箱：[xianniana@gmail.com](mailto:xianniana@gmail.com)。
