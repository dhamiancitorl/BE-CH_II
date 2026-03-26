# BE_2-proyecto

## Resumen

API REST de sesiones y autenticación con **Passport** y capas **router → controller → service → DAO**. Incluye registro, login, usuario actual, logout, ruta de prueba para **admin**, y recuperación de contraseña por correo (token JWT de 1 hora).

**Estrategia:**

- **Passport Local** para registro e inicio de sesión (email + contraseña).
- **Passport JWT** (cookie `httpOnly` `jwt`) para rutas que validan la sesión (`current`, `logout`, `admin-test`).
- El JWT de sesión se firma con **jsonwebtoken** e incluye `expiresIn` configurable (`JWT_EXPIRES_IN` en `.env`).
- Las respuestas de usuario usan un **DTO** (`UserDTO.sessionData`) con datos públicos (sin contraseña ni `_id` en esas respuestas).

Las contraseñas se hashean con **bcrypt**. La persistencia es **MongoDB** (Mongoose). El envío de correos usa **Nodemailer** (p. ej. Gmail con app password).

---

## Librerías usadas

| Librería           | Uso                                         |
| ------------------ | ------------------------------------------- |
| **express**        | Servidor y rutas                            |
| **mongoose**       | ODM para MongoDB                            |
| **passport**       | Autenticación                               |
| **passport-local** | Registro / login (email + password)         |
| **passport-jwt**   | Validación del JWT leído de la cookie       |
| **jsonwebtoken**   | Firma del JWT de sesión y token de reset    |
| **bcrypt**         | Hash de contraseñas                         |
| **cookie-parser**  | Lectura de la cookie `jwt`                  |
| **dotenv**         | Variables de entorno                        |
| **nodemailer**     | Envío de correos (bienvenida, recuperación) |

---

## Endpoints disponibles

Base URL: `/api/sessions`

| Método | Ruta                | Descripción                                      | Auth        |
| ------ | ------------------- | ------------------------------------------------ | ----------- |
| POST   | `/register`         | Registrar usuario                                | No          |
| POST   | `/login`            | Login (setea cookie `jwt` + datos públicos user) | No          |
| GET    | `/current`          | Usuario actual (desde JWT en cookie)             | Sí (cookie) |
| POST   | `/logout`           | Borra cookie `jwt`                               | Sí (cookie) |
| GET    | `/admin-test`       | Prueba de acceso solo **rol admin**              | Sí + admin  |
| POST   | `/recover-password` | Solicita recuperación (correo con token 1h)      | No          |
| POST   | `/reset-password`   | Restablece contraseña con token + nueva pass     | No          |

---

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

**2. Login** (el servidor responde con la cookie `jwt` y el usuario público)

```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@mail.com",
  "password": "miPassword123"
}
```

**3. Usuario actual** (enviando la cookie `jwt`)

```http
GET /api/sessions/current
Cookie: jwt=<token>
```

**4. Logout**

```http
POST /api/sessions/logout
Cookie: jwt=<token>
```

**5. Recuperar contraseña** (respuesta genérica aunque el email no exista)

```http
POST /api/sessions/recover-password
Content-Type: application/json

{
  "email": "juan@mail.com"
}
```

El correo incluye el **token** e instrucciones para **Postman**: `POST /api/sessions/reset-password` con JSON `token` y `newPassword`.

Esto es a modo educativo - API REST que no tiene un FRONT o vista

**6. Restablecer contraseña** (token del mail, válido 1 hora; no permite reutilizar la misma contraseña)

```http
POST /api/sessions/reset-password
Content-Type: application/json

{
  "token": "<token_del_correo>",
  "newPassword": "otraPassword456"
}
```

**7. Panel admin (prueba)** — el usuario debe tener `role: "admin"` en la base

```http
GET /api/sessions/admin-test
Cookie: jwt=<token>
```

---

## Cómo correr el proyecto

1. Instalar dependencias: `npm install`
2. Crear archivo `.env` con al menos:
   - `PORT`
   - `MONGO_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (ej. `7d`)
   - `EMAIL_USER`, `EMAIL_PASS`, `MAILING_SERVICE`, `MAILING_PORT` (para correos)
3. Ejecutar: `npm run dev` (desarrollo) o `npm start` (producción)
