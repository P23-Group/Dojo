
DOJO - Authentication API

. POST /auth/register

Creates a new user account.

Request:
json
{
  "name": "Alex",
  "email": "alex1@example.com",
  "password": "password123"
}


Success — 201:
json
{
  "message": "User created successfully"
}


Errors:
 400 - Missing required fields.
 400 - Invalid name (3-20 characters).
 400 - Invalid email (5-50 characters, must match validation).
 400 - Invalid password (8-50 characters, must contain a letter and number).
 400 - Email already exists.
 500 - Internal server error.

2. POST /auth/login

Authenticates a user and returns a JWT token.

Request:
json
{
  "email": "alex1@example.com",
  "password": "password123"
}

Success — 200:
json
{
  "token": "JWT_TOKEN"
}


Token expiration: 1 hour.

Errors:
 400 - Missing required fields.
 401 - Invalid password or email.
 404 - User not found.
 500 - Internal server error.

3. GET /me

Returns the authenticated user's profile.

Required header:
Authorization: Bearer "JWT_TOKEN"

Request body: None.

Success — 200 (example):
json
{
  "name": "Alex",
  "email": "alex1@example.com",
  "lvl": 1,
  "xp": 0,
  "streak": 0,
  "longestStreak": 0,
  "lastActiveDate": null
}


The actual response depends on the User model and stored data.

Errors:
 401 - No token provided.
 404 - User not found.
 500 - Internal server error (including invalid JWT).

Notes

Passwords are stored as bcrypt hashes.
JWT is required for GET /me.
The server requires MONGO_URI, JWT_SECRET and PORT configuration.
Missing or incorrectly typed request fields may cause server errors before validation.