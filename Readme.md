# Backend API – Node.js (TypeScript) | AWS | Auth0 | CI/CD

## 📌 Descripción
API backend desarrollada con **Node.js, TypeScript y Express**, utilizando **MongoDB**
como base de datos y desplegada en **AWS** mediante una arquitectura basada en contenedores.

El proyecto implementa **autenticación con Auth0 y JWT**, separación de ambientes
(**DEV / PROD**) y despliegue automatizado mediante **GitHub Actions**.

El manejo de archivos y documentos se realiza mediante **Backblaze B2**, optimizando
costos frente a soluciones tradicionales como S3.

---

## 🏗️ Arquitectura
- Backend: Node.js + TypeScript + Express
- Base de datos: MongoDB (local y MongoDB Atlas)
- Autenticación: Auth0 + JWT
- Contenedores: Docker
- CI/CD: GitHub Actions
- Cloud:
  - AWS: ECS, ECR, Application Load Balancer, CloudFront
  - Backblaze B2: almacenamiento de documentos

**Flujo general:**

Usuario → CloudFront → Application Load Balancer → ECS → MongoDB  
                                                ↳ Backblaze B2 (documentos)

Cada ambiente cuenta con infraestructura independiente.

---

## 🌿 Flujo de ramas y ambientes

El repositorio maneja el siguiente flujo:

### 🔹 GT_Oauth0 (default)
Rama principal del proyecto y base de desarrollo.

### 🔹 GT_Oauth0_Dev
Entorno de desarrollo / staging.
- Desplegado en AWS ECS
- CloudFront propio
- Infraestructura independiente (Task Definition, Service, Target Group)
- Normalmente **apagado** para optimizar costos
- Se enciende solo para pruebas o nuevas funcionalidades

### 🔹 GT_Oauth0_Prod
Entorno productivo.
- Infraestructura activa
- Exposición pública
- Despliegue controlado mediante CI/CD

Cada entorno posee:
- Task Definition
- ECS Service
- Target Group
- Distribución CloudFront independiente

---

## 🚀 CI/CD
El proyecto utiliza **GitHub Actions** para automatizar:

1. Build de la imagen Docker.
2. Push de la imagen a **Amazon ECR**.
3. Despliegue automático en **Amazon ECS**.

Los pipelines se ejecutan únicamente cuando se hace `push` a:
- `GT_Oauth0_Dev`
- `GT_Oauth0_Prod`

---

## 🔐 Autenticación y seguridad
La autenticación se maneja mediante:

- **Auth0** como Identity Provider (OAuth 2.0).
- **JWT manual** para control de sesiones y autorización.
- Integración entre Auth0 y JWT para validación de accesos.
- Middleware para protección de endpoints.

---

## 📁 Manejo de documentos
El almacenamiento de archivos se realiza mediante **Backblaze B2**:

- Buckets dedicados por ambiente
- Carga y acceso controlado desde el backend
- Credenciales gestionadas mediante variables de entorno
- Separación total entre lógica de negocio y almacenamiento

---

## 📋 Requisitos previos
- Node.js >= 18
- npm
- Docker (opcional)
- MongoDB local o MongoDB Atlas
- Cuenta en Auth0
- Cuenta en AWS
- Cuenta en Backblaze B2

---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

> ⚠️ El archivo `.env` **no se versiona** y está incluido en `.gitignore`.

```env
# Server
PORT=8097
URL_SWAGGER=http://localhost:8097/api

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/task_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8097

# Backblaze B2
BUCKET_NAME=your_bucket_name
BUCKET_ID=your_bucket_id
API_KEY=your_api_key
KEY_ID=your_key_id
KEY_NAME=your_key_name

# Auth0
OAUTH_AUDIENCE=https://gesttaskapi/
OAUTH_DOMAIN=https://your-domain.us.auth0.com/
