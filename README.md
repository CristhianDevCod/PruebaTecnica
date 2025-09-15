# 📰 News Semantic Search

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.2-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Aplicación web para la **creación, visualización y búsqueda semántica de noticias**, desarrollada con **Next.js**, **PostgreSQL**, **Prisma** y un microservicio de **FastAPI** que genera *embeddings* con `sentence-transformers`.

---

## 📑 Tabla de contenidos

1. [Requisitos previos](#-requisitos-previos)  
2. [Configuración inicial](#-configuración-inicial)  
3. [Ejecutar el proyecto con Docker](#️-ejecutar-el-proyecto-con-docker)  
4. [Pruebas rápidas](#-pruebas-rápidas)  
5. [Migraciones de base de datos](#️-migraciones-de-base-de-datos)  
6. [Estructura del proyecto](#-estructura-del-proyecto)  
7. [Desarrollo sin Docker](#-desarrollo-sin-docker-opcional)  
8. [Notas](#-notas)  
9. [Licencia](#-licencia)  

---

## 🚀 Requisitos previos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados.  
- (Opcional) [curl](https://curl.se/) para probar endpoints desde consola.  

---

## ⚙️ Configuración inicial

1. Clona este repositorio:

   ```bash
   git clone https://github.com/CristhianDevCod/PruebaTecnica.git
   cd news-semantic-search

2. Copia el archivo de variables de entorno de ejemplo:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=newsdb
POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:root@db:5432/newsdb?schema=public

RUN_PRISMA_MIGRATE=1

PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin

NEXT_PUBLIC_API_URL=http://localhost:3000/api
AI_SERVICE_URL=http://ai-model:8000


3) Construir y levantar todo (primer arranque real)

Este es el comando principal que lanza y construye las imágenes y servicios:
docker compose up --build -d