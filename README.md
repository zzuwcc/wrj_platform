# 无人机对战与侦察任务前端平台

本项目为基于 React + Vite 的无人机对战、侦察任务参数配置前端页面。

## 功能简介
- 支持选择 6 个不同的场景地图，每个地图对应不同的参数输入页面
- 所有场景为红蓝双方对抗，左为红方、右为蓝方，配色区分明显
- 对战场景（map1-3）：红蓝双方均有侦察机和战斗机，数量略有不同
- 侦察场景（map4-6）：红方为侦察机，蓝方为防空系统
- 支持为每个机型/系统输入参数

## 使用方法

### 1. 安装依赖

在项目根目录下运行：

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

启动后，终端会显示本地访问地址，通常为：

```
http://localhost:5173
```

用浏览器打开即可访问页面。

### 3. 使用说明

- 页面左上角下拉框选择场景地图。
- 选择后页面会显示红蓝双方的参数输入区域。
- 填写侦察机、战斗机、防空系统的参数。
- 点击底部"开始"按钮即可进行后续操作。



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
