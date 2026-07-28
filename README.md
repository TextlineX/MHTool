# URL Scheme 唤醒助手

基于 Vite + 原生 TypeScript，适合直接部署到 Vercel。

## 本地运行

```bash
npm install
npm run dev
```

## Vercel 部署

在 Vercel 导入项目后使用默认配置即可：

- Framework Preset：`Vite`
- Build Command：`npm run build`
- Output Directory：`dist`
- Install Command：`npm install`

`vercel.json` 已配置 `/wake` 和 `/redirect` 的 SPA 重写，因此部署后可以直接访问：

```text
https://你的域名.vercel.app/redirect?url=mhapp%3A%2F%2Fopen%2Fhome
```

其中：

- `target`：客户端注册的 URL Scheme，必须经过 URL 编码
