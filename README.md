# News Semantic Search

## Descripción del proyecto

**News Semantic Search** es una aplicación web desarrollada con **Next.js** que permite crear, editar, eliminar y buscar noticias. La aplicación utiliza una **base de datos PostgreSQL** para almacenar la información, y cuenta con integración de un **modelo de IA local** (`all-MiniLM-L6-v2`) para realizar **búsquedas semánticas** de noticias, facilitando encontrar resultados relevantes más allá de la coincidencia literal de palabras.

La aplicación incluye las siguientes funcionalidades:

- **CRUD completo de noticias**:  
  - Crear noticias mediante un formulario con título, autor, contenido y URL de imagen.  
  - Editar y actualizar noticias existentes.  
  - Eliminar noticias de manera permanente.  
- **Búsqueda tradicional y semántica**:  
  - Buscar noticias por coincidencia de palabras clave.  
  - Realizar búsquedas semánticas usando un modelo de IA local, permitiendo resultados más inteligentes y relevantes.  

---

## Tecnologías utilizadas

- **Frontend**: Next.js  
- **Backend / API**: Next.js API Routes  
- **Base de datos**: PostgreSQL  
- **ORM**: Prisma  
- **Inteligencia Artificial**: Modelo local `all-MiniLM-L6-v2` para embeddings semánticos  
- **Contenedores**: Docker y Docker Compose  

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- Node.js (solo si quieres correr Next.js fuera de Docker para desarrollo local)  

---

## Configuración del proyecto

1. Clonar el repositorio:
```bash
git clone https://github.com/CristhianDevCod/PruebaTecnica.git
cd news-semantic-search

PRIMER paso
docker compose up --build -d

segundo paso, verificar que los contenedores esten corriendo
docker compose ps

tercer paso ver los logs del contenedor web:
docker compose logs -f web

si todo esta correcto, se accede a la web
http://localhost:3000
