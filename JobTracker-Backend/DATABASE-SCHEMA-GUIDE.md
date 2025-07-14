# 🗄️ Database Schema Documentation

## 🎓 **Understanding the JobTracker Database Structure**

This document explains every aspect of your database design with learning-focused explanations.

---

## 📊 **Database Overview**

### **What is a Database Schema?**
A database schema is like a **blueprint for your data storage**. It defines:
- **What tables** exist (User, Job, Resume)
- **What fields** each table has (email, company, fileName)
- **How tables relate** to each other (one user has many jobs)
- **What rules** govern the data (email must be unique)

### **Why Use Prisma ORM?**
- **ORM = Object-Relational Mapping**
- **Translates** between JavaScript objects and database tables
- **Type-safe** - prevents common database errors
- **Easy migrations** - handles database updates automatically
- **Generated client** - provides convenient database methods

---

## 👤 **User Model (users table)**

### **Purpose:**
Stores information about people using your JobTracker application.

### **Fields Explained:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | Int | ✅ | Unique identifier (auto-increments) | 1, 2, 3... |
| `email` | String | ✅ | Login email (must be unique) | "john@example.com" |
| `password` | String | ✅ | Encrypted password | "$2b$10$hash..." |
| `firstName` | String | ✅ | User's first name | "John" |
| `lastName` | String | ✅ | User's last name | "Doe" |
| `phone` | String? | ❌ | Phone number (optional) | "+1-555-0123" |
| `location` | String? | ❌ | City/location (optional) | "San Francisco, CA" |
| `profilePicture` | String? | ❌ | URL to profile image | "https://s3.../photo.jpg" |
| `createdAt` | DateTime | ✅ | Account creation time | "2024-01-15T10:30:00Z" |
| `updatedAt` | DateTime | ✅ | Last profile update | "2024-01-20T14:45:00Z" |

### **Relationships:**
- **One user** can have **many jobs** (1:many)
- **One user** can have **many resumes** (1:many)

### **Database Constraints:**
- `@id`: Primary key (unique identifier)
- `@unique`: Email must be unique across all users
- `@default(autoincrement())`: ID automatically increases
- `@default(now())`: Sets current timestamp when created
- `@updatedAt`: Automatically updates when record changes

---

## 💼 **Job Model (jobs table)**

### **Purpose:**
Tracks job applications and their progress through the hiring process.

### **Fields Explained:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | Int | ✅ | Unique job identifier | 1, 2, 3... |
| `userId` | Int | ✅ | Links to user who owns this job | 1 |
| `company` | String | ✅ | Company name | "Google" |
| `position` | String | ✅ | Job title | "Software Engineer" |
| `location` | String? | ❌ | Job location | "Mountain View, CA" |
| `jobType` | String? | ❌ | Employment type | "full-time", "contract" |
| `salary` | String? | ❌ | Salary information | "$120k - $150k" |
| `description` | String? | ❌ | Job description | "Build awesome products..." |
| `requirements` | String? | ❌ | Required skills | "React, Node.js, 3+ years" |
| `applicationUrl` | String? | ❌ | Where to apply | "https://jobs.google.com/..." |
| `status` | String | ✅ | Application status | "applied", "interviewing" |
| `priority` | String | ✅ | How important this job is | "high", "medium", "low" |
| `notes` | String? | ❌ | Personal notes | "Really excited about this!" |
| `appliedAt` | DateTime? | ❌ | When application was sent | "2024-01-15T09:00:00Z" |
| `interviewDate` | DateTime? | ❌ | Scheduled interview time | "2024-01-22T14:00:00Z" |
| `followUpDate` | DateTime? | ❌ | When to follow up | "2024-02-01T10:00:00Z" |
| `createdAt` | DateTime | ✅ | When job was added | "2024-01-10T08:30:00Z" |
| `updatedAt` | DateTime | ✅ | Last update time | "2024-01-16T11:45:00Z" |

### **Status Options:**
- **"wishlist"**: Jobs you want to apply to (default)
- **"applied"**: Application submitted
- **"interviewing"**: In interview process
- **"offered"**: Job offer received
- **"rejected"**: Application rejected
- **"accepted"**: Offer accepted

### **Priority Levels:**
- **"high"**: Dream jobs or urgent applications
- **"medium"**: Standard interest (default)
- **"low"**: Nice-to-have jobs

### **Relationships:**
- **Each job** belongs to **one user** (many:1)
- Uses `userId` as foreign key to link to users table

---

## 📄 **Resume Model (resumes table)**

### **Purpose:**
Manages resume files uploaded by users for job applications.

### **Fields Explained:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | Int | ✅ | Unique resume identifier | 1, 2, 3... |
| `userId` | Int | ✅ | Links to user who owns this resume | 1 |
| `title` | String | ✅ | User-friendly resume name | "Software Developer Resume" |
| `originalName` | String | ✅ | Original filename when uploaded | "john_doe_resume.pdf" |
| `fileName` | String | ✅ | Unique filename in storage | "resume_123456789.pdf" |
| `s3Url` | String | ✅ | Full URL to access file | "https://s3.../resume_123.pdf" |
| `fileSize` | Int | ✅ | File size in bytes | 1048576 (1MB) |
| `mimeType` | String | ✅ | File type | "application/pdf" |
| `resumeType` | String | ✅ | Category of resume | "technical", "general" |
| `description` | String? | ❌ | Optional notes about resume | "Updated with latest projects" |
| `isActive` | Boolean | ✅ | Whether currently using this resume | true, false |
| `downloadCount` | Int | ✅ | Times file has been downloaded | 0, 5, 12... |
| `createdAt` | DateTime | ✅ | When resume was uploaded | "2024-01-10T15:30:00Z" |
| `updatedAt` | DateTime | ✅ | Last update time | "2024-01-11T09:15:00Z" |

### **Resume Types:**
- **"general"**: All-purpose resume (default)
- **"technical"**: For software/engineering positions
- **"creative"**: For design/creative roles
- **"executive"**: For leadership positions
- **"custom"**: Customized for specific applications

### **File Storage Strategy:**
- **originalName**: Preserves user's filename for display
- **fileName**: Unique name prevents conflicts in storage
- **s3Url**: Direct link to file in AWS S3 cloud storage
- **fileSize**: Helps with storage management and limits
- **mimeType**: Ensures proper file handling and security

### **Relationships:**
- **Each resume** belongs to **one user** (many:1)
- Uses `userId` as foreign key to link to users table

---

## 🔗 **Relationships Explained**

### **One-to-Many Relationships:**

```
User (1) ──────── has many ──────── Jobs (many)
 │                                    │
 └─────────── has many ──────── Resumes (many)
```

### **What This Means:**
- **One user** can create **multiple job applications**
- **One user** can upload **multiple resumes**
- **Each job** belongs to **exactly one user**
- **Each resume** belongs to **exactly one user**

### **Foreign Keys:**
- `Job.userId` → `User.id` (links job to its owner)
- `Resume.userId` → `User.id` (links resume to its owner)

### **Cascade Deletion:**
- When a **user is deleted**, all their **jobs are deleted**
- When a **user is deleted**, all their **resumes are deleted**
- This prevents orphaned data (jobs/resumes without owners)

---

## 🔧 **Prisma Features Used**

### **Decorators Explained:**

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@id` | Primary key field | `id Int @id` |
| `@unique` | Must be unique across table | `email String @unique` |
| `@default()` | Default value when creating | `status String @default("wishlist")` |
| `@default(autoincrement())` | Auto-incrementing number | `id Int @id @default(autoincrement())` |
| `@default(now())` | Current timestamp | `createdAt DateTime @default(now())` |
| `@updatedAt` | Auto-update on changes | `updatedAt DateTime @updatedAt` |
| `@@map()` | Custom table name | `@@map("users")` |

### **Data Types Used:**

| Prisma Type | Database Type | JavaScript Type | Example |
|-------------|---------------|------------------|---------|
| `Int` | INTEGER | number | 123 |
| `String` | TEXT/VARCHAR | string | "Hello World" |
| `Boolean` | BOOLEAN | boolean | true, false |
| `DateTime` | TIMESTAMP | Date | new Date() |
| `String?` | TEXT (nullable) | string \| null | "text" or null |

---

## 🚀 **Next Steps**

### **1. Generate Prisma Client**
```bash
npx prisma generate
```
**Creates JavaScript client code** for database operations

### **2. Create Database**
```bash
npx prisma db push
```
**Creates actual database tables** based on schema

### **3. View Database**
```bash
npx prisma studio
```
**Opens visual database browser** in your web browser

### **4. Use in Code**
```javascript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Create a new user
const user = await prisma.user.create({
  data: {
    email: "john@example.com",
    password: "hashedPassword",
    firstName: "John",
    lastName: "Doe"
  }
})
```

---

## 🎓 **Learning Concepts**

### **Database Fundamentals:**
- ✅ **Primary Keys**: Unique identifiers for records
- ✅ **Foreign Keys**: Links between tables
- ✅ **Relationships**: How data connects (1:many, many:many)
- ✅ **Constraints**: Rules that keep data clean
- ✅ **Indexes**: Make queries faster (unique fields)

### **ORM Benefits:**
- ✅ **Type Safety**: Prevents many runtime errors
- ✅ **Auto-completion**: IDE helps with field names
- ✅ **Migration Management**: Tracks database changes
- ✅ **Relationship Queries**: Easy to fetch related data
- ✅ **Query Building**: No SQL knowledge required

### **Best Practices Implemented:**
- ✅ **Consistent Naming**: camelCase for fields, snake_case for tables
- ✅ **Timestamps**: Track when records are created/updated
- ✅ **Nullable Fields**: Optional data marked with ?
- ✅ **Default Values**: Sensible defaults for required fields
- ✅ **Cascade Deletion**: Clean up related records

**🎉 This schema provides a solid, scalable foundation for your JobTracker application!** 🚀
