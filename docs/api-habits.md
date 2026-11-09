DOJO — Habits API

1. GET /habits

Returns today's habits with progress information.

Request body: None.

Success — 200 OK
json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Drink Water",
    "type": "helpful",
    "trackingFormat": "counter",
    "goalValue": 4,
    "todayValue": 2,
    "completed": false
  }
]

Errors: 500 - Internal server error.

2. POST /habits

Creates a new habit.

Request body:
json
{
  "habit": {
    "name": "Drink Water",
    "category": "Health",
    "type": "helpful",
    "trackingFormat": "counter",
    "goalValue": 4,
    "goalUnit": "glasses",
    "frequency": [1, 2, 3, 4, 5, 6, 7]
  }
}

Success:= 200 OK - Empty response.

Errors:
 400 - Habit data was not provided.
 400 - Goal value is less than zero.
 400 - Invalid frequency (must contain unique days 1-7).
 500 - Server or database error, including some validation failures.

3. PUT /habits/:id

Updates the specified habit.

Request body:
json
{
  "habit": {
    "name": "Morning Workout",
    "goalValue": 30
  }
}

Success: 200 OK - Empty response.

Errors:
 400 - Habit data was not provided.
 404 - Habit not found.
 500 - Server error or failed database validation.

4. DELETE /habits/:id

Deletes the specified habit.

Request body: None.

Success: 200 OK - Empty response.

Errors:
 404 - Habit not found.
 500 - Internal server error.

5. POST /habits/:id/check-ins

Records progress for a habit on a specific date.

Request body:
json
{
  "date": "2026-11-08",
  "value": 1
}

Success - 200 OK:

When completed, returns a CheckIn object:
json
{
  "habitId": "507f1f77bcf86cd799439011",
  "userId": "usr_972a4b81c3e0",
  "date": "2026-11-08",
  "value": 4,
  "completed": true
}

When progress is incomplete, returns an empty response.

If already completed:
json
{
  "message": "This habit already completed for today"
}


Errors:
 400 - Date cannot be in future.
 404 - Habit not found.
 500 - Internal server error, including some invalid dates.

Notes

Habit types: helpful, harmfu.
Tracking formats: counter, yes_no.
Frequency: 1 = Monday, 7 = Sunday.
The server sets userId automatically.
Some validation failures currently return 500 instead of 400.
Examples are based on source code, not live API tests.