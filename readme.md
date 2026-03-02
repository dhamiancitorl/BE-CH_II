# BE_2-proyecto

## Resumen

API REST de sesiones y autenticación con **Passport**. Permite registro, login, sesión actual (JWT) y logout.

**Estrategia:** Autenticación con **Passport** usando:

- **Local Strategy** para registro e inicio de sesión (email + contraseña).
- **JWT Strategy** para proteger rutas: el token se guarda en una cookie `httpOnly` y se valida en cada petición.

Las contraseñas se hashean con **bcrypt**. La persistencia es con **MongoDB** (Mongoose).

---

## Librerías usadas

| Librería           | Uso                             |
| ------------------ | ------------------------------- |
| **express**        | Servidor y rutas                |
| **mongoose**       | ODM para MongoDB                |
| **passport**       | Autenticación                   |
| **passport-local** | Login/registro (email/password) |
| **passport-jwt**   | Validación de token JWT         |
| **jsonwebtoken**   | Generación y firma de JWT       |
| **bcrypt**         | Hash de contraseñas             |
| **cookie-parser**  | Lectura de cookies (JWT)        |
| **dotenv**         | Variables de entorno            |

---

## Endpoints disponibles

Base URL: `/api/sessions`

| Método | Ruta        | Descripción                          | Auth        |
| ------ | ----------- | ------------------------------------ | ----------- |
| POST   | `/register` | Registrar usuario                    | No          |
| POST   | `/login`    | Iniciar sesión (devuelve cookie JWT) | No          |
| GET    | `/current`  | Usuario actual (desde JWT)           | Sí (cookie) |
| POST   | `/logout`   | Cerrar sesión (borra cookie)         | No          |

### Ejemplo: registro y login

**1. Registrar usuario**

```http
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@mail.com",
  "age": 25,
  "password": "miPassword123"
}
```

**2. Login** (el servidor responde con la cookie `jwt` y el usuario)

```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@mail.com",
  "password": "miPassword123"
}
```

**3. Usuario actual** (enviando la cookie `jwt` en la petición)

```http
GET /api/sessions/current
Cookie: jwt=<token>
```

---

## Cómo correr el proyecto

1. Instalar dependencias: `npm install`
2. Crear archivo `.env` con `PORT`, `MONGO_URI` y `JWT_SECRET`
3. Ejecutar: `npm run dev` (desarrollo) o `npm start` (producción)
