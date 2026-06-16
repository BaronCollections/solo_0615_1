# Smart Campus Management System

This repository contains a Vue 3, TypeScript, Vite, and Element Plus smart campus management demo.

## Test Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher` | `teacher123` |
| Student | `student` | `student123` |

## Current Implementation

- Login page with the existing admin, teacher, and student mock accounts.
- Auth state stored in a local Vue composable and persisted with `localStorage`.
- Main application shell with a fixed sidebar, top header, role tag, user menu, and logout action.
- Role-filtered sidebar menu data from local mock files.
- Dashboard cards for today's courses, pending tasks, campus notices, attendance overview, and system status.
- Local mock data only; no backend API is required.

## Known Verification Issue

The role-based application shell is visible after login, but the sidebar navigation is not fully wired to real feature pages yet.

At the moment, selecting items such as course list, attendance management, campus notices, or system management updates the active menu/title path but still renders the dashboard content area. The current implementation should therefore be treated as a dashboard shell plus mock data presentation, not as a fully complete multi-page campus management workflow.

## Local Development

```bash
npm install
npm run dev
```

## Build Check

```bash
npm run build
```
