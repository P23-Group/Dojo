--
Метод: GET
URL: "/"
Опис: Головна сторiнка, тест.
Тіло запиту: відсутнє

Успішна відповідь — 200 OK
{
  "status": "ok"
}

--
Метод: POST
URL: "/auth/register"
Опис: Створення нового користувача.
Тіло запиту (JSON):
{
    "name": "name",
    "email": "email",
    "password": "password"
}
Успішна відповідь — 201 Created
{
  "message": "User created successfully"
}

--
Метод: POST
URL: "/auth/login"
Опис: авторiзацiя.
Тіло запиту (JSON):
{
    "email": "email",
    "password": "password"
}
Успішна відповідь — 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...."
}

--
Метод: GET
URL: "/me"
Опис: авторiзацiя.
Заголовок запиту (Headers):
{
    Authorization: Bearer eyJhbGcieyJhbGciOiJIUzI1NiIsInR....
}
Успішна відповідь — 200 OK
{
    "name": "name",
    "email": "email",
    "lvl": 1,
    "xp": 0
}