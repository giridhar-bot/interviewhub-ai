# InterviewHub AI — API Documentation

## Base URL
`/api/v1/`

## Authentication
All protected endpoints require a valid session token via cookie.

## Response Format
```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

## Error Format
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "requestId": "uuid"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 429: Rate Limited
- 500: Internal Error
