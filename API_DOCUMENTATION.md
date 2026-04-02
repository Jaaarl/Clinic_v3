# Clinic v3 API Documentation

Generated: 2026-04-02

## Base URL

```
/api
```

All endpoints return JSON with CORS headers. Use `OPTIONS` to check CORS support.

---

## Patient API

### `GET /api/patient`
Get all patients, optionally filtered by search query.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search query to filter patients |

**Response:**
```json
{
  "patients": [
    {
      "_id": "string",
      "name": "string",
      "gender": "male|female",
      "birthday": "ISO date string",
      "contact": {
        "phone": "string",
        "email": "string",
        "address": {
          "street": "string",
          "city": "string",
          "province": "string",
          "zip": "string"
        }
      },
      "medical_history": {
        "allergies": ["string"],
        "conditions": ["string"],
        "surgeries": ["string"]
      },
      "medications": ["string"],
      "visit_history": [
        {
          "visit_date": "ISO date string",
          "soap": {
            "subjective": "string",
            "objective": "string",
            "assessment": "string",
            "plan": "string"
          },
          "vitals": {
            "height": "number",
            "weight": "number",
            "respiratory_rate": "number",
            "blood_pressure": "string",
            "heart_rate": "number",
            "temperature": "number"
          },
          "form": {
            "reseta": "string",
            "labReq": "string"
          }
        }
      ]
    }
  ]
}
```

**Errors:**
- `500`: Failed to fetch patients

---

### `POST /api/patient`
Create a new patient.

**Request Body:**
```json
{
  "name": "string (required)",
  "gender": "male|female (required)",
  "birthday": "ISO date string (required)",
  "contact": {
    "phone": "string",
    "email": "string",
    "address": {
      "street": "string",
      "city": "string",
      "province": "string",
      "zip": "string"
    }
  },
  "medical_history": {
    "allergies": ["string"],
    "conditions": ["string"],
    "surgeries": ["string"]
  },
  "medications": ["string"],
  "visit_history": [{}]
}
```

**Response:**
```json
{
  "message": "Patient Created",
  "patient": { /* Patient object */ }
}
```

**Errors:**
- `400`: Failed to create patient

---

### `DELETE /api/patient`
Delete a patient by ID.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Patient ID |

**Response:**
```json
{
  "message": "Patient deleted"
}
```

**Errors:**
- `400`: ID is required
- `500`: Failed to delete patient

---

### `GET /api/patient/[id]`
Get a single patient by ID.

**Response:**
```json
{
  "patient": { /* Patient object */ }
}
```

**Errors:**
- `404`: Patient not found
- `500`: Failed to fetch patient

---

### `PUT /api/patient/[id]`
Update a patient. Revalidates `/queue` and `/queue/[id]` pages after update.

**Request Body:** Same as `POST /api/patient`

**Response:**
```json
{
  "message": "Patient updated",
  "patient": { /* Updated patient object */ }
}
```

**Errors:**
- `400`: Failed to update patient
- `404`: Patient not found

---

### `DELETE /api/patient/[id]`
Delete a patient by ID.

**Response:**
```json
{
  "message": "Patient deleted"
}
```

**Errors:**
- `400`: ID is required
- `500`: Failed to delete patient

---

## Queue API

### `GET /api/queue`
Get all queue entries.

**Response:**
```json
{
  "queueEntries": [
    {
      "_id": "string",
      "patientId": "string",
      "queue_number": "number",
      "date": "ISO date string",
      "status": "string",
      "priority": "string",
      "patient": { /* Patient object */ }
    }
  ]
}
```

**Errors:**
- `500`: Failed to fetch queue

---

### `POST /api/queue`
Add a patient to the queue.

**Request Body:**
```json
{
  "referenceId": "string (required, patient ID)"
}
```

**Response:**
```json
{
  "queueEntry": { /* Queue entry object */ },
  "queueNumber": "number"
}
```

**Errors:**
- `400`: Failed to create queue entry

---

### `GET /api/queue/[id]`
Get a queue entry with associated patient data.

**Response:**
```json
{
  "queueEntry": { /* Queue entry object */ },
  "patient": { /* Patient object */ }
}
```

**Errors:**
- `400`: ID is required
- `500`: Failed to fetch queue entry

---

### `DELETE /api/queue/[id]`
Remove a patient from the queue.

**Response:**
```json
{
  "message": "Queue entry deleted"
}
```

OR

```json
{
  "message": "Queue entry not found"
}
```

**Errors:**
- `400`: ID is required
- `500`: Failed to delete queue entry

---

## Queue Numbers API

### `GET /api/queue-numbers`
Get queue numbers filtered by date range.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | Start date filter (ISO format) |
| `endDate` | string | No | End date filter (ISO format) |

**Response:**
```json
{
  "queueNumbers": [
    {
      "_id": "string",
      "queue_number": "number",
      "date": "ISO date string"
    }
  ]
}
```

**Errors:**
- `500`: Failed to fetch queue numbers

---

### `POST /api/queue-numbers`
Create a new queue number.

**Request Body:**
```json
{
  "date": "ISO date string"
}
```

**Response:**
```json
{
  "_id": "string",
  "queue_number": "number",
  "date": "ISO date string"
}
```

**Errors:**
- `500`: Failed to create queue number

---

## Inventory API

### `GET /api/inventory`
Get all inventory items.

**Response:**
```json
{
  "inventoryItems": [
    {
      "_id": "string",
      "name": "string",
      "category": "string",
      "stock": "number",
      "price": "number",
      "expirationDate": "ISO date string",
      "supplier": "string"
    }
  ]
}
```

**Errors:**
- `500`: Failed to fetch inventory

---

### `POST /api/inventory`
Add a new inventory item.

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string",
  "stock": "number (required)",
  "price": "number (required)",
  "expirationDate": "ISO date string",
  "supplier": "string"
}
```

**Response:**
```json
{
  "message": "Item added successfully",
  "newItem": { /* Inventory item object */ }
}
```

**Errors:**
- `400`: Failed to add item

---

### `GET /api/inventory/[id]`
Get a single inventory item by ID.

**Response:**
```json
{
  "inventory": { /* Inventory item object */ }
}
```

**Errors:**
- `404`: Inventory not found
- `500`: Failed to fetch inventory

---

### `PUT /api/inventory/[id]`
Update an inventory item.

**Request Body:**
```json
{
  "name": "string",
  "category": "string",
  "stock": "number",
  "price": "number",
  "expirationDate": "ISO date string",
  "supplier": "string",
  "reason": "string (required for audit log)"
}
```

**Response:**
```json
{
  "message": "Inventory updated",
  "item": { /* Updated inventory object */ }
}
```

**Errors:**
- `400`: Failed to update inventory
- `404`: Inventory not found

---

### `DELETE /api/inventory/[id]`
Delete an inventory item.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Inventory item ID |

**Response:**
```json
{
  "message": "Inventory deleted"
}
```

**Errors:**
- `400`: Failed to delete item
- `404`: Item not found

---

### `PATCH /api/inventory/[id]`
Deduct stock from an inventory item.

**Request Body:**
```json
{
  "quantityToDeduct": "number (required)"
}
```

**Response:**
```json
{
  "message": "Inventory updated",
  "item": { /* Updated inventory object */ }
}
```

**Errors:**
- `400`: ID and quantityToDeduct are required, or insufficient stock
- `404`: Item not found

---

## Inventory Logs API

### `GET /api/inventory-logs`
Get inventory logs with optional filters.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inventoryId` | string | No | Filter by inventory item ID |
| `itemName` | string | No | Filter by item name |
| `action` | string | No | Filter by action type |
| `limit` | number | No | Number of results (default: 50) |
| `page` | number | No | Page number (default: 1) |

**Response:**
```json
{
  "logs": [
    {
      "_id": "string",
      "inventoryId": "string",
      "itemName": "string",
      "action": "string",
      "quantity": "number",
      "previousStock": "number",
      "newStock": "number",
      "reason": "string",
      "createdAt": "ISO date string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

**Errors:**
- `500`: Failed to fetch logs

---

### `GET /api/inventory-logs/sales`
Get sales data with date range filters.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `inventoryId` | string | No | Filter by inventory item ID |
| `itemName` | string | No | Filter by item name |
| `startDate` | string | No | Start date (ISO format) |
| `endDate` | string | No | End date (ISO format) |
| `expirationStartDate` | string | No | Expiration start date filter |
| `expirationEndDate` | string | No | Expiration end date filter |
| `includeExpired` | boolean | No | Include expired items (default: true) |

**Response:**
```json
{
  "sales": [
    {
      "_id": "string",
      "itemName": "string",
      "totalQuantity": "number",
      "totalRevenue": "number",
      "expirationDate": "ISO date string"
    }
  ]
}
```

**Errors:**
- `500`: Failed to calculate sales

---

## Doctor API

### `GET /api/doctor`
Get all doctors.

**Response:**
```json
{
  "doctors": [
    {
      "_id": "string",
      "name": "string",
      "specialization": "string",
      "license": "string",
      "contact": {
        "phone": "string",
        "email": "string"
      }
    }
  ]
}
```

**Errors:**
- `500`: Failed to fetch doctors

---

### `POST /api/doctor`
Create a new doctor.

**Request Body:**
```json
{
  "name": "string (required)",
  "specialization": "string",
  "license": "string",
  "contact": {
    "phone": "string",
    "email": "string"
  }
}
```

**Response:**
```json
{
  "message": "Doctor Created",
  "doctor": { /* Doctor object */ }
}
```

**Errors:**
- `400`: Failed to create doctor

---

### `GET /api/doctor/[id]`
Get a single doctor by ID.

**Response:**
```json
{
  "doctor": { /* Doctor object */ }
}
```

**Errors:**
- `404`: Doctor not found
- `500`: Failed to fetch doctor

---

### `PUT /api/doctor/[id]`
Update a doctor.

**Request Body:** Same as `POST /api/doctor`

**Response:**
```json
{
  "message": "Doctor updated",
  "doctor": { /* Updated doctor object */ }
}
```

**Errors:**
- `400`: Failed to update doctor
- `404`: Doctor not found

---

## Clinic Info API

### `GET /api/clinic-info`
Get clinic information.

**Response:**
```json
{
  "clinicInfo": {
    "_id": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "hours": "string",
    "ptr": "string",
    "s2": "string",
    "license": "string"
  }
}
```

**Errors:**
- `500`: Failed

---

### `PUT /api/clinic-info`
Update clinic information.

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "hours": "string",
  "ptr": "string",
  "s2": "string",
  "license": "string"
}
```

**Response:**
```json
{
  "message": "Clinic info updated",
  "clinicInfo": { /* Updated clinic info object */ }
}
```

**Errors:**
- `500`: Failed

---

## Logs API

### `POST /api/logs`
Create a log entry.

**Request Body:**
```json
{
  "action": "string (required)",
  "details": "string",
  "userId": "string",
  "metadata": {}
}
```

**Response:**
```json
{
  "_id": "string",
  "action": "string",
  "details": "string",
  "userId": "string",
  "metadata": {},
  "createdAt": "ISO date string"
}
```

**Errors:**
- `500`: Failed to create log entry

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message string"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `204` | No Content (CORS preflight) |
| `400` | Bad Request |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## CORS

All endpoints support CORS preflight via `OPTIONS` method.

Headers included:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version`
