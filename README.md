# Al-Itqan Institute Backend

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=3000
NODE_ENV=production

# Database Configuration (Hostinger MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alitqan_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_super_secret_key_here_al_itqan_2024_secure_token
JWT_EXPIRE=7d

# Admin Credentials (Will be auto-seeded)
ADMIN_EMAIL=pass93630@gmail.com
ADMIN_PASSWORD=WAQASkhan@5713079

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## Installation

```bash
npm install
npm run seed
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Courses
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses (admin)
- PUT /api/courses/:id (admin)
- DELETE /api/courses/:id (admin)

### Blogs
- GET /api/blogs
- GET /api/blogs/:id
- POST /api/blogs (admin)
- PUT /api/blogs/:id (admin)
- DELETE /api/blogs/:id (admin)

### Admissions
- POST /api/admissions/student
- POST /api/admissions/teacher
- GET /api/admin/admissions (admin)
- PUT /api/admin/admissions/:id (admin)

### Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/stats

### Notifications
- GET /api/notifications
- POST /api/notifications (admin)

## Security Features

- Helmet.js security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- XSS protection
- SQL injection protection via ORM
- JWT authentication
- bcrypt password hashing
- Disposable email blocking
