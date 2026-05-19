## URL

http://localhost:8000/api

## Endpoint:

/verify-otp

## Method:

POST

## Authentication:

N/A

## Request:

```json
{
  "otp": "123456",
  "type": "forget",
  "email": "example@gmail.com",
  "password": "password",
  "password_confirmation": "password"
}
```

## Response

```json
{
  "status": 200,
  "message": "Verify otp successfully",
  "data": true
}
```
