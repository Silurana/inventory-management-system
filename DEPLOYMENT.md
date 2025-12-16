# Deployment Guide for Inventory Management System (IMS)

This project is set up as a monorepo with `backend` and `frontend` directories. To deploy on Vercel, follow these steps:

## Prerequisites

- Push this code to a GitHub repository.

## Step 1: Deploy Backend

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. **Configure Project**:
   - **Project Name**: e.g., `ims-backend`
   - **Root Directory**: Click "Edit" and select `backend`.
   - **Environment Variables**: Add the variables from your local `.env` file:
     - `MONGO_URI`: Your MongoDB connection string.
     - `JWT_SECRET`: Your secret key for JWT.
5. Click **Deploy**.
6. Once deployed, copy the **Deployment Domain** (e.g., `https://ims-backend.vercel.app`).

## Step 2: Deploy Frontend

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import the **same** GitHub repository again.
4. **Configure Project**:
   - **Project Name**: e.g., `ims-frontend`
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Framework Preset**: Verify it is set to **Vite**.
   - **Environment Variables**:
     - `VITE_API_URL`: Set this to your backend URL appended with `/api`.
       - Example: `https://ims-backend.vercel.app/api`
5. Click **Deploy**.

## Troubleshooting

- If the frontend cannot communicate with the backend, check the Console in your browser's Developer Tools.
- Ensure the `VITE_API_URL` does _not_ have a trailing slash if not expected, or matches the format `https://.../api`.
