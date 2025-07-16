# KINTA SME API

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.15.1-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

A robust Next.js API for managing digital services including airtime purchases, data plans, utility payments, and financial transactions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [Models](#models)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [License](#license)

## Overview

KINTA SME API is a Next.js-based backend service designed to provide digital services such as airtime purchases, data plans, utility bill payments (electricity), exam card purchases, and financial transactions. The API supports user authentication, account management, transaction processing, and administrative functions.

### Key Features

- **User Authentication**: Secure login, signup, and password management
- **Account Management**: Virtual account creation and management
- **Financial Transactions**: Process payments, transfers, and account funding
- **Digital Services**:
  - Airtime purchases
  - Data plan subscriptions
  - Electricity bill payments
  - Exam card purchases
  - Recharge card generation
- **Admin Dashboard**: User management, transaction monitoring, and service configuration
- **Referral System**: Track and manage user referrals

## Installation

### Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn package manager

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/data-next-api.git
cd data-next-api
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# API Keys
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key
FLW_PUBK=your_flutterwave_public_key
FLW_SECK=your_flutterwave_secret_key
FLW_SECRET_HASH=your_flutterwave_secret_hash
BUDPAY_SECRET_KEY=your_budpay_secret_key

# Email
RESEND_API_KEY=your_resend_api_key
HOST_EMAIL=your_email_address
HOST_EMAIL_PASSWORD=your_email_password

# RapidAPI
X-RAPIDAPI-HOST=your_rapidapi_host
X-RAPIDAPI-KEY=your_rapidapi_key
```

## Quick Start

1. Start the development server

```bash
npm run dev
# or
yarn dev
```

2. The API will be available at [http://localhost:3000](http://localhost:3000)

3. Test the API with a simple GET request to the root endpoint

```bash
curl http://localhost:3000
# Expected response: {"message":"Hello world!"}
```

## API Documentation

### Authentication Endpoints

#### **POST /api/auth/sign-up**

Register a new user

**Request Body:**

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "password123",
  "country": "nigeria",
  "phoneNumber": "1234567890",
  "ref": "referral_code" // Optional
}
```

**Response:**

```json
{
  "status": 201,
  "message": "USER_CREATED",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "user@example.com",
      "phoneNumber": "1234567890",
      "country": "nigeria",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

#### **POST /api/auth/login**

Authenticate a user

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "LOGIN_SUCCESS",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "user@example.com",
      "balance": 1000,
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### **POST /api/auth/forget-password**

Request password reset

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "PASSWORD_RESET_EMAIL_SENT"
}
```

#### **POST /api/auth/reset-password**

Reset user password

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "PASSWORD_RESET_SUCCESS"
}
```

#### **GET /api/auth/me**

Get current user information

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "USER_FOUND",
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "balance": 1000,
    "role": "user"
  }
}
```

#### **POST /api/auth/pin/create**

Create transaction PIN

**Request Body:**

```json
{
  "pin": "1234"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "PIN_CREATED_SUCCESSFULLY"
}
```

#### **PUT /api/auth/pin/update**

Update transaction PIN

**Request Body:**

```json
{
  "oldPin": "1234",
  "newPin": "5678"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "PIN_UPDATED_SUCCESSFULLY"
}
```

#### **POST /api/auth/logout**

Log out current user

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "LOGOUT_SUCCESS"
}
```

### Account Endpoints

#### **GET /api/account/me**

Get user account details

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "ACCOUNT_FOUND",
  "data": {
    "accountDetails": {
      "accountName": "John Doe",
      "accountNumber": "1234567890",
      "bankName": "Bank Name",
      "bankCode": "123"
    },
    "hasDedicatedAccountNumber": true
  }
}
```

#### **POST /api/account/bank/create-transaction-charge**

Create a transaction charge

**Request Body:**

```json
{
  "amount": 1000,
  "note": "Funding account"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTION_CHARGE_CREATED",
  "data": {
    "tx_ref": "transaction_reference",
    "amount": 1000,
    "status": "pending"
  }
}
```

#### **GET /api/account/bank/get-transfer-fee**

Get transfer fee information

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSFER_FEE_RETRIEVED",
  "data": {
    "fee": 10.5
  }
}
```

#### **POST /api/account/bank/verify-transaction**

Verify a transaction

**Request Body:**

```json
{
  "transaction_id": "transaction_id"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTION_VERIFIED",
  "data": {
    "tx_ref": "transaction_reference",
    "amount": 1000,
    "status": "success"
  }
}
```

#### **POST /api/account/bank/verify-transaction-with-tx-ref**

Verify transaction with reference

**Request Body:**

```json
{
  "tx_ref": "transaction_reference"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTION_VERIFIED",
  "data": {
    "tx_ref": "transaction_reference",
    "amount": 1000,
    "status": "success"
  }
}
```

### Purchase Endpoints

#### **POST /api/purchase/airtime**

Purchase airtime

**Request Body:**

```json
{
  "pin": "1234",
  "amount": 100,
  "network": "Mtn",
  "phoneNumber": "1234567890",
  "byPassValidator": false // Optional
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "AIRTIME_PURCHASE_SUCCESSFUL",
  "data": {
    "transaction": {
      "_id": "transaction_id",
      "amount": 100,
      "status": "success",
      "type": "airtime",
      "tx_ref": "transaction_reference"
    }
  }
}
```

#### **POST /api/purchase/data**

Purchase data plan

**Request Body:**

```json
{
  "pin": "1234",
  "_id": "data_plan_id",
  "phoneNumber": "1234567890",
  "byPassValidator": false // Optional
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "DATA_PURCHASE_SUCCESSFUL",
  "data": {
    "transaction": {
      "_id": "transaction_id",
      "amount": 500,
      "status": "success",
      "type": "data",
      "tx_ref": "transaction_reference"
    }
  }
}
```

#### **POST /api/purchase/electricity**

Pay electricity bill

**Request Body:**

```json
{
  "electricityId": "electricity_provider_id",
  "meterNumber": "meter_number",
  "amount": 1000,
  "pin": "1234",
  "byPassValidator": false // Optional
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "ELECTRICITY_PAYMENT_SUCCESSFUL",
  "data": {
    "transaction": {
      "_id": "transaction_id",
      "amount": 1000,
      "status": "success",
      "type": "bill",
      "tx_ref": "transaction_reference"
    },
    "token": "electricity_token"
  }
}
```

#### **POST /api/purchase/exam**

Purchase exam card

**Request Body:**

```json
{
  "examId": "exam_id",
  "quantity": 1,
  "pin": "1234"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "EXAM_CARD_PURCHASE_SUCCESSFUL",
  "data": {
    "transaction": {
      "_id": "transaction_id",
      "amount": 2000,
      "status": "success",
      "type": "exam",
      "tx_ref": "transaction_reference"
    },
    "examCards": [
      {
        "pin": "exam_pin",
        "serialNumber": "serial_number"
      }
    ]
  }
}
```

### Transaction Endpoints

#### **GET /api/transactions/all**

Get all user transactions

**Query Parameters:**

```
page=1 (optional)
perPage=10 (optional)
status=success (optional - filter by status)
type=airtime (optional - filter by type)
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTIONS_FOUND",
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "amount": 1000,
        "status": "success",
        "type": "funding",
        "tx_ref": "transaction_reference",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "perPage": 10,
      "pages": 5
    }
  }
}
```

#### **GET /api/transactions/last**

Get user's last transactions

**Query Parameters:**

```
limit=5 (optional - number of transactions to return)
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTIONS_FOUND",
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "amount": 1000,
        "status": "success",
        "type": "funding",
        "tx_ref": "transaction_reference",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### **GET /api/transactions/get-transaction**

Get specific transaction details

**Query Parameters:**

```
tx_ref=transaction_reference
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTION_FOUND",
  "data": {
    "_id": "transaction_id",
    "amount": 1000,
    "status": "success",
    "type": "funding",
    "tx_ref": "transaction_reference",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "note": "Funding account"
  }
}
```

### User Endpoints

#### **GET /api/users/me**

Get current user profile

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "USER_FOUND",
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "balance": 1000,
    "role": "user"
  }
}
```

#### **DELETE /api/users/me/delete**

Delete user account

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "USER_DELETED_SUCCESSFULLY"
}
```

#### **GET /api/users/me/recently-used**

Get recently used contacts

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "RECENTLY_USED_CONTACTS_FOUND",
  "data": [
    {
      "number": "1234567890",
      "network": "Mtn",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **POST /api/users/me/reset-password**

Reset user password

**Request Body:**

```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "PASSWORD_RESET_SUCCESS"
}
```

#### **POST /api/users/me/verify-account**

Verify user account

**Request Body:**

```json
{
  "otp": "123456"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "ACCOUNT_VERIFIED_SUCCESSFULLY"
}
```

#### **POST /api/users/message**

Send message to user

**Request Body:**

```json
{
  "subject": "Message Subject",
  "message": "Message content"
}
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "MESSAGE_SENT_SUCCESSFULLY"
}
```

#### **GET /api/users/referrals**

Get user referrals

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "REFERRALS_FOUND",
  "data": {
    "referrals": [
      {
        "_id": "referral_id",
        "referredUser": {
          "_id": "user_id",
          "fullName": "John Doe"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalReferrals": 5,
    "referralCode": "REF123"
  }
}
```

### Admin Endpoints

#### **GET /api/admin/overview**

Get admin dashboard overview

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "OVERVIEW_RETRIEVED",
  "data": {
    "totalUsers": 100,
    "totalTransactions": 500,
    "totalRevenue": 50000,
    "activeUsers": 80
  }
}
```

#### **GET /api/admin/users**

Get all users

**Query Parameters:**

```
page=1 (optional)
perPage=10 (optional)
status=active (optional - filter by status)
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "USERS_FOUND",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "user@example.com",
        "phoneNumber": "1234567890",
        "balance": 1000,
        "role": "user",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "perPage": 10,
      "pages": 10
    }
  }
}
```

#### **GET /api/admin/transactions**

Get all transactions

**Query Parameters:**

```
page=1 (optional)
perPage=10 (optional)
status=success (optional - filter by status)
type=airtime (optional - filter by type)
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "TRANSACTIONS_FOUND",
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "amount": 1000,
        "status": "success",
        "type": "funding",
        "tx_ref": "transaction_reference",
        "user": {
          "_id": "user_id",
          "fullName": "John Doe"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 500,
      "page": 1,
      "perPage": 10,
      "pages": 50
    }
  }
}
```

#### **GET /api/admin/data**

Get data plan information

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "DATA_PLANS_FOUND",
  "data": {
    "dataPlans": [
      {
        "_id": "data_plan_id",
        "network": "Mtn",
        "data": "1GB",
        "amount": 500,
        "type": "SME",
        "availability": "30 Days",
        "isPopular": true,
        "planId": 123,
        "provider": "buyVTU"
      }
    ]
  }
}
```

#### **GET /api/admin/electricity**

Get electricity payment information

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "ELECTRICITY_PAYMENTS_FOUND",
  "data": {
    "electricityPayments": [
      {
        "_id": "payment_id",
        "meterNumber": "meter_number",
        "amount": 1000,
        "token": "electricity_token",
        "user": {
          "_id": "user_id",
          "fullName": "John Doe"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### **GET /api/admin/referrals**

Get all referrals

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "REFERRALS_FOUND",
  "data": {
    "referrals": [
      {
        "_id": "referral_id",
        "referrer": {
          "_id": "user_id",
          "fullName": "John Doe"
        },
        "referred": {
          "_id": "user_id",
          "fullName": "Jane Doe"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "totalReferrals": 50
  }
}
```

#### **GET /api/admin/settings**

Get application settings

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "status": 200,
  "message": "SETTINGS_FOUND",
  "data": {
    "systemPasswordPolicy": {
      "minLength": 6,
      "requireSpecialChar": true
    },
    "accountRequiresVerificationBeforeVirtualAccountActivation": true,
    "referralBonus": 100
  }
}
```

## Architecture

### Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── account/         # Account management endpoints
│   │   ├── admin/           # Admin dashboard endpoints
│   │   ├── auth/            # Authentication endpoints
│   │   ├── create/          # Resource creation endpoints
│   │   ├── purchase/        # Purchase service endpoints
│   │   ├── transactions/    # Transaction endpoints
│   │   └── users/           # User management endpoints
│   └── route.ts             # Root API route
├── lib/                     # Utility functions and constants
│   ├── connect-to-db.ts     # Database connection
│   ├── constants.ts         # Application constants
│   ├── jwt.ts               # JWT authentication utilities
│   ├── server-utils.ts      # Server-side utilities
│   ├── utils.ts             # General utilities
│   └── validator.schema.ts  # Validation schemas
├── middleware.ts            # API middleware (CORS, etc.)
├── models/                  # MongoDB models
│   ├── account.ts           # Account model
│   ├── app.ts               # Application settings model
│   ├── data-plan.ts         # Data plan model
│   ├── electricity.ts       # Electricity payment model
│   ├── exam.ts              # Exam card model
│   ├── message.ts           # Message model
│   ├── otp.ts               # OTP model
│   ├── password-reset-token.ts # Password reset token model
│   ├── recently-used-contact.ts # Recently used contact model
│   ├── referral.ts          # Referral model
│   ├── transactions.ts      # Transaction model
│   └── users.ts             # User model
└── types.ts                 # TypeScript type definitions
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. NextAuth.js is implemented for handling authentication flows.

### Authentication Flow

1. User registers or logs in
2. Server validates credentials and issues a JWT
3. JWT is stored as an HTTP-only cookie
4. Subsequent requests include the JWT for authentication
5. Protected routes verify the JWT before processing requests

## Models

### User Model

Stores user information including authentication details, account status, and balance.

```typescript
interface IUser {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  balance: number;
  auth: {
    email: string;
    password: string;
    transactionPin: string;
  };
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
  hasSetPin: boolean;
  isEmailVerified: boolean;
}
```

### Transaction Model

Records all financial transactions in the system.

```typescript
interface transaction {
  amount: number;
  note?: string;
  status: "pending" | "success" | "failed";
  paymentMethod: "virtualAccount" | "dedicatedAccount" | "ownAccount";
  tx_ref: string;
  type: "funding" | "airtime" | "bill" | "data" | "exam" | "recharge-card";
  user: string;
  accountId?: string;
}
```

### Account Model

Manages virtual account details for users.

```typescript
interface dedicatedAccountNumber {
  accountDetails: {
    accountName: string;
    accountNumber: string;
    accountRef: string;
    bankName: string;
    bankCode: string;
    expirationDate: string;
  };
  user: string;
  hasDedicatedAccountNumber: boolean;
  order_ref: string;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation for API changes
- Follow the existing code style

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

### Deploy on Vercel

The easiest way to deploy this Next.js API is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Configure environment variables
4. Deploy

## Environment Variables

| Variable              | Description                      |
| --------------------- | -------------------------------- |
| `MONGODB_URI`         | MongoDB connection string        |
| `NEXTAUTH_SECRET`     | Secret for NextAuth.js           |
| `NEXTAUTH_URL`        | URL for NextAuth.js              |
| `FLW_ENCRYPTION_KEY`  | Flutterwave encryption key       |
| `FLW_PUBK`            | Flutterwave public key           |
| `FLW_SECK`            | Flutterwave secret key           |
| `FLW_SECRET_HASH`     | Flutterwave secret hash          |
| `BUDPAY_SECRET_KEY`   | BudPay secret key                |
| `RESEND_API_KEY`      | Resend API key for emails        |
| `HOST_EMAIL`          | Email address for sending emails |
| `HOST_EMAIL_PASSWORD` | Password for email account       |
| `X-RAPIDAPI-HOST`     | RapidAPI host                    |
| `X-RAPIDAPI-KEY`      | RapidAPI key                     |

## License

This project is proprietary software. All rights reserved.

© 2023 KINTA SME. All rights reserved.
