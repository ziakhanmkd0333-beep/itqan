# Al-Itqan Institute - Backend API

Base URL: `https://itqaninstitute.com/api`

## Authentication

Most API endpoints require authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### AUTHENTICATION

#### Register
```
POST /api/auth/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "STUDENT"
}
```

#### Login
```
POST /api/auth/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
```

---

### COURSES

#### List All Courses
```
GET /api/courses
```

Query parameters:
- `category` - Filter by category (Quran, Arabic, Fiqh, Sarf, Hadith)
- `level` - Filter by level (Beginner, Intermediate, Advanced, Specialized)
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

#### Get Course Details
```
GET /api/courses/:id
```

#### Create Course (Admin only)
```
POST /api/courses
Authorization: Bearer <token>
```

Request body:
```json
{
  "title": "Course Name",
  "category": "Quran",
  "level": "Beginner",
  "duration": "3 Months",
  "fee_usd": "$30",
  "description": "Course description...",
  "learning_outcomes": "What students will learn..."
}
```

#### Update Course (Admin only)
```
PUT /api/courses/:id
Authorization: Bearer <token>
```

#### Delete Course (Admin only)
```
DELETE /api/courses/:id
Authorization: Bearer <token>
```

---

### BLOGS

#### List All Blogs
```
GET /api/blogs
```

#### Get Blog by Slug
```
GET /api/blogs/slug/:slug
```

#### Create Blog (Admin only)
```
POST /api/blogs
Authorization: Bearer <token>
```

Request body:
```json
{
  "title": "Blog Title",
  "content": "Blog content...",
  "category": "Islamic Education",
  "featured": true
}
```

---

### ADMISSIONS

#### Submit Student Application
```
POST /api/admissions/student
```

Request body:
```json
{
  "full_name": "Student Name",
  "email": "student@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "city": "New York",
  "father_name": "Father Name",
  "gender": "male",
  "date_of_birth": "2000-01-01",
  "course_id": 1,
  "study_mode": "one-to-one",
  "preferred_time": "morning",
  "preferred_language": "english",
  "password": "SecurePass123"
}
```

#### Submit Teacher Application
```
POST /api/admissions/teacher
```

Request body:
```json
{
  "full_name": "Teacher Name",
  "email": "teacher@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "city": "New York",
  "highest_qualification": "Master's in Islamic Studies",
  "experience": "5+ Years",
  "primary_specialization": "Quran",
  "languages_known": ["English", "Arabic"],
  "password": "SecurePass123"
}
```

---

### ADMIN

#### Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### List All Users
```
GET /api/admin/users
Authorization: Bearer <token>
```

#### Update Admission Status
```
PUT /api/admissions/:id/status
Authorization: Bearer <token>
```

Request body:
```json
{
  "status": "approved",
  "notes": "Application approved"
}
```

#### Create Notification
```
POST /api/admin/notifications
Authorization: Bearer <token>
```

Request body:
```json
{
  "title": "New Announcement",
  "message": "Message content...",
  "type": "announcement",
  "target_audience": "all"
}
```

---

### NOTIFICATIONS

#### Get Public Notifications
```
GET /api/notifications/public
```

#### Get Daily Ayah
```
GET /api/notifications/daily-ayah
```

#### Get Daily Hadith
```
GET /api/notifications/daily-hadith
```

---

### UPLOADS

#### Upload Image
```
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form field: `image`

---

## Response Format

All responses follow this format:

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev only)"
}
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Roles

- `SUPER_ADMIN` - Full access
- `ADMIN` - Manage courses, blogs, admissions, users
- `TEACHER` - Manage assigned courses
- `STUDENT` - View courses, enroll, track progress
