## URL

http://localhost:8000/api

## Endpoint:

/orders

## Method:

POST

## Authentication:

Authorization: Bearer {{access_token}}

## Request:

N/A

## Response

```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user_id": 3,
    "status": "pending",
    "totalAmount": 450000,
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 12:00:00",
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 150000,
        "totalMoney": 300000,
        "options": {
          "sizes": "M",
          "colors": "Red"
        },
        "product": {
          "id": 7,
          "name": "Classic T-Shirt",
          "images": [
            {
              "id": 1,
              "img_path": "https://example.com/images/shirt.jpg"
            }
          ]
        }
      }
    ]
  }
}
```
