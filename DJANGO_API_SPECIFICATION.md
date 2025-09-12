# Django Backend API Specification

This document outlines the complete API specification for the OFS Ledger Django backend. Use this as a reference when implementing the Django REST API.

## Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
- [User Management](#user-management)
- [Wallet Management](#wallet-management)
- [Coin Balances](#coin-balances)
- [KYC Management](#kyc-management)
- [Statistics & Analytics](#statistics--analytics)
- [File Uploads](#file-uploads)
- [Database Models](#database-models)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

## Base Configuration

```python
# Django Settings
BASE_URL = "http://localhost:8000"
API_BASE_URL = "http://localhost:8000/api"

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "http://localhost:8080",  # Current frontend port
]

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

## Authentication Endpoints

### POST /api/auth/login/
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_staff": false,
    "is_superuser": false,
    "date_joined": "2025-01-01T00:00:00Z",
    "last_login": "2025-01-15T10:30:00Z",
    "groups": [],
    "user_permissions": []
  },
  "profile": {
    "id": 1,
    "user": 1,
    "full_name": "John Doe",
    "phone": null,
    "country": null,
    "timezone": "UTC",
    "avatar_url": null,
    "role": "user",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

### POST /api/auth/register/
Register a new user.

**Request:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Response:** Same as login response.

### POST /api/auth/logout/
Logout and blacklist refresh token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### POST /api/auth/token/refresh/
Refresh access token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### GET /api/auth/user/
Get current user information.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_staff": false,
  "is_superuser": false,
  "date_joined": "2025-01-01T00:00:00Z",
  "last_login": "2025-01-15T10:30:00Z",
  "groups": [],
  "user_permissions": []
}
```

### GET /api/csrf/
Get CSRF token for forms.

**Response:**
```json
{
  "csrfToken": "abc123..."
}
```

## User Management

### GET /api/users/
List all users (admin only) with pagination and filtering.

**Query Parameters:**
- `search`: Search by username, email, or name
- `is_active`: Filter by active status
- `is_staff`: Filter by staff status
- `role`: Filter by profile role (user/admin)
- `date_joined_after`: Filter by join date
- `ordering`: Order by field (e.g., `-date_joined`)
- `page`: Page number
- `page_size`: Items per page (default: 20)

**Response:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_active": true,
      "is_staff": false,
      "is_superuser": false,
      "date_joined": "2025-01-01T00:00:00Z",
      "last_login": "2025-01-15T10:30:00Z",
      "profile": {
        "id": 1,
        "user": 1,
        "full_name": "John Doe",
        "phone": "+1234567890",
        "country": "US",
        "timezone": "America/New_York",
        "avatar_url": "https://example.com/avatar.jpg",
        "role": "user",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      },
      "wallets_count": 3,
      "last_activity": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/users/{id}/
Get specific user details.

### POST /api/users/
Create new user (admin only).

### PATCH /api/users/{id}/
Update user (admin only).

### DELETE /api/users/{id}/
Delete user (admin only).

### GET /api/users/stats/
Get user statistics.

**Response:**
```json
{
  "total_users": 1250,
  "active_users": 892,
  "new_users_today": 15,
  "new_users_this_week": 73,
  "users_with_wallets": 456,
  "users_with_validated_wallets": 234,
  "admin_users": 5,
  "inactive_users": 358
}
```

## Wallet Management

### GET /api/wallets/
List wallet connections with filtering.

**Query Parameters:**
- `user`: Filter by user ID
- `chain_type`: Filter by blockchain
- `validation_status`: Filter by validation status
- `search`: Search by wallet address
- `ordering`: Order results

**Response:**
```json
{
  "count": 45,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
      "chain_type": "ethereum",
      "wallet_type": "metamask",
      "wallet_name": "Main Ethereum Wallet",
      "is_validated": true,
      "validation_status": "validated",
      "connected_at": "2025-01-10T14:30:00Z",
      "validated_at": "2025-01-11T09:15:00Z",
      "validator_notes": "Ownership verified",
      "created_at": "2025-01-10T14:30:00Z",
      "updated_at": "2025-01-11T09:15:00Z",
      "user_email": "user@example.com",
      "user_name": "John Doe"
    }
  ]
}
```

### POST /api/wallets/
Connect new wallet.

**Request:**
```json
{
  "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
  "chain_type": "ethereum",
  "wallet_type": "metamask",
  "wallet_name": "My Wallet",
  "signature": "0x...",
  "message": "I own this wallet address"
}
```

### POST /api/wallets/{id}/validate/
Validate wallet (admin only).

**Request:**
```json
{
  "validation_status": "validated",
  "validator_notes": "Ownership verified through signature"
}
```

### GET /api/wallets/stats/
Get wallet statistics.

**Response:**
```json
{
  "total_wallets": 1234,
  "validated_wallets": 892,
  "pending_wallets": 234,
  "rejected_wallets": 108,
  "validation_rate": 89.2,
  "total_balance_usd": "2500000.00",
  "active_chains": ["ethereum", "bitcoin", "solana", "polygon"]
}
```

### GET /api/wallets/supported-chains/
Get supported blockchain networks.

**Response:**
```json
[
  {
    "chain_type": "ethereum",
    "name": "Ethereum",
    "is_active": true
  },
  {
    "chain_type": "bitcoin", 
    "name": "Bitcoin",
    "is_active": true
  }
]
```

### GET /api/wallets/supported-types/
Get supported wallet types.

## Coin Balances

### GET /api/coin-balances/
List coin balances (filtered by user).

### GET /api/coin-balances/me/
Get current user's coin balances.

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "coin_symbol": "BTC",
    "coin_name": "Bitcoin",
    "balance": "0.50000000",
    "usd_value": "22500.00",
    "last_updated": "2025-01-15T10:30:00Z",
    "is_active": true,
    "created_at": "2025-01-10T14:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "user": 1,
    "coin_symbol": "ETH",
    "coin_name": "Ethereum", 
    "balance": "5.25000000",
    "usd_value": "12000.00",
    "last_updated": "2025-01-15T10:30:00Z",
    "is_active": true,
    "created_at": "2025-01-10T14:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

### POST /api/coin-balances/
Add/update coin balance (admin only).

**Request:**
```json
{
  "user_id": 1,
  "coin_symbol": "BTC",
  "balance": "0.75000000",
  "usd_value": "33750.00"
}
```

## KYC Management

### GET /api/kyc-documents/
List KYC documents.

### POST /api/kyc-documents/
Submit KYC documents.

**Request:** (multipart/form-data)
```
document_type: "passport"
document_number: "A12345678"
front_image: [File]
back_image: [File]
selfie_image: [File]
```

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "document_type": "passport",
  "document_number": "A12345678",
  "front_image_url": "https://storage.example.com/kyc/front_123.jpg",
  "back_image_url": "https://storage.example.com/kyc/back_123.jpg",
  "selfie_image_url": "https://storage.example.com/kyc/selfie_123.jpg",
  "status": "pending",
  "submitted_at": "2025-01-15T10:30:00Z",
  "reviewed_at": null,
  "reviewer": null,
  "rejection_reason": null,
  "notes": null,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### PATCH /api/kyc-documents/{id}/
Update KYC document status (admin only).

## Database Models

### Django Models Structure

```python
# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from decimal import Decimal

class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=2, null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    avatar_url = models.URLField(null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WalletConnection(models.Model):
    CHAIN_CHOICES = [
        ('ethereum', 'Ethereum'),
        ('bitcoin', 'Bitcoin'),
        ('solana', 'Solana'),
        ('polygon', 'Polygon'),
        ('binance_smart_chain', 'Binance Smart Chain'),
    ]
    
    WALLET_TYPE_CHOICES = [
        ('metamask', 'MetaMask'),
        ('trust_wallet', 'Trust Wallet'),
        ('coinbase_wallet', 'Coinbase Wallet'),
        ('phantom', 'Phantom'),
        ('other', 'Other'),
    ]
    
    VALIDATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('validated', 'Validated'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallets')
    wallet_address = models.CharField(max_length=100)
    chain_type = models.CharField(max_length=20, choices=CHAIN_CHOICES)
    wallet_type = models.CharField(max_length=20, choices=WALLET_TYPE_CHOICES)
    wallet_name = models.CharField(max_length=100, null=True, blank=True)
    is_validated = models.BooleanField(default=False)
    validation_status = models.CharField(max_length=10, choices=VALIDATION_STATUS_CHOICES, default='pending')
    connected_at = models.DateTimeField(auto_now_add=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    validator_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'wallet_address', 'chain_type']

class CoinBalance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coin_balances')
    coin_symbol = models.CharField(max_length=10)
    coin_name = models.CharField(max_length=50)
    balance = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0'))
    usd_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'coin_symbol']

class KycDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('passport', 'Passport'),
        ('driver_license', 'Driver License'),
        ('national_id', 'National ID'),
        ('utility_bill', 'Utility Bill'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kyc_documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    document_number = models.CharField(max_length=50)
    front_image_url = models.URLField(null=True, blank=True)
    back_image_url = models.URLField(null=True, blank=True)
    selfie_image_url = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_kyc_documents')
    rejection_reason = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Response Formats

### Success Response
```json
{
  "data": { /* response data */ },
  "message": "Success message (optional)",
  "status": "success"
}
```

### Paginated Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=3",
  "previous": "http://localhost:8000/api/endpoint/?page=1",
  "results": [ /* array of data */ ]
}
```

### Error Response
```json
{
  "detail": "Error message",
  "errors": {
    "field_name": ["Field specific error message"]
  },
  "non_field_errors": ["General error message"],
  "status_code": 400
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Common Error Responses

**Validation Error (400):**
```json
{
  "email": ["This field is required."],
  "password": ["This password is too short."]
}
```

**Authentication Error (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Permission Error (403):**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

## Required Django Packages

```txt
Django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
django-cors-headers==4.0.0
django-filter==23.2
Pillow==9.5.0
python-decouple==3.8
psycopg2-binary==2.9.6  # For PostgreSQL
redis==4.5.5  # For caching/sessions
celery==5.2.7  # For background tasks
```

This specification provides everything your Django developer needs to implement the backend API that will work seamlessly with the frontend!