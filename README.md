# Beautify Dashboard

A comprehensive multi-tenant beauty services marketplace dashboard built with Next.js 16 and React 19. This project demonstrates modern frontend development practices including complex state management, responsive design, and scalable architecture.

## Overview

Beautify Dashboard is a full-featured admin and merchant management system for a beauty services marketplace. It includes two distinct interfaces:

- **Admin Portal** - Platform-wide management for users, merchants, bookings, financials, and system settings
- **Merchant Portal** - Business management tools for service providers including bookings, customers, analytics, and marketing

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16.1 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |
| Forms | React Hook Form, Yup |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Real-time | Socket.io Client |

## Features

### Admin Portal
- User and merchant management with approval workflows
- Business profile and category management
- Platform-wide booking oversight
- Financial analytics and transaction monitoring
- System settings and security configuration
- Real-time notifications

### Merchant Portal
- Service catalog management with availability scheduling
- Booking management with calendar integration
- Customer relationship management (CRM)
- Financial reporting and payment tracking
- Marketing and promotions management
- Business analytics dashboard

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin portal routes
│   ├── merchant/          # Merchant portal routes
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components (sidebars, headers)
│   ├── enhanced/          # Feature-rich components
│   └── [feature]/         # Feature-specific components
├── hooks/                 # Custom React hooks
├── services/              # API and external service integrations
├── store/                 # Redux store configuration
│   └── slices/            # Redux Toolkit slices
└── lib/                   # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs on `http://localhost:3003`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run all tests
npm run test:e2e     # Run Playwright E2E tests
```

## Architecture Highlights

- **App Router Layout Pattern** - Persistent layouts for optimal navigation performance
- **Redux Toolkit** - Centralized state management with typed slices
- **Custom Hooks** - Reusable logic for authentication, API calls, and performance monitoring
- **Component Library** - Consistent UI components built on Radix UI primitives
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Real-time Updates** - Socket.io integration for live notifications

## Demo Credentials

| Portal | Email | Password |
|--------|-------|----------|
| Admin | admin@beautify.com | Admin1234! |
| Merchant | merchant@beautify.com | Merchant1234! |

## License

This project is for portfolio demonstration purposes.
