# React Native App with Best Practices

This is a React Native application built with Expo and NativeWind, following modern React Native best practices.

## Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Component Architecture**: Modular component structure with proper separation of concerns
- **Error Handling**: Error boundaries for graceful error handling
- **Accessibility**: Comprehensive accessibility support with proper ARIA labels and roles
- **Performance**: Optimized with React.memo, useCallback, and useMemo where appropriate
- **Navigation**: Custom bottom navigation with animated icons
- **Styling**: NativeWind (Tailwind CSS) for consistent styling
- **Icons**: Lucide React Native icons with custom wrappers

## Best Practices Implemented

### 1. TypeScript
- Strict type checking enabled
- Proper interface definitions for all components
- Shared types in `app/types.ts`
- Type-safe navigation and state management

### 2. Component Structure
- Functional components with hooks
- Proper prop interfaces
- Separation of concerns
- Reusable animated components

### 3. Error Handling
- Error boundaries at multiple levels
- Graceful error recovery
- Proper error logging

### 4. Accessibility
- `accessibilityRole` props on interactive elements
- `accessibilityLabel` and `accessibilityHint` for screen readers
- Proper focus management
- Semantic HTML structure

### 5. Performance
- `useCallback` for event handlers
- `useMemo` for expensive computations
- Optimized re-renders
- Proper dependency arrays

### 6. Code Organization
- Shared types in dedicated files
- Consistent file naming
- Proper import/export structure
- Clean component hierarchy

## Project Structure

```
app/
├── index.tsx          # Main screen with navigation
├── home.tsx           # Home page with feature grid
├── profile.tsx        # Profile page
├── chat.tsx           # Chat interface
├── calendar.tsx       # Calendar page
├── error-boundary.tsx # Error boundary component
├── types.ts           # Shared TypeScript types
└── _layout.tsx        # Root layout configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run on specific platforms:
   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Development Guidelines

- Always use TypeScript interfaces for component props
- Implement proper error boundaries
- Add accessibility props to interactive elements
- Use React.memo for expensive components
- Follow the established component patterns
- Keep components focused and single-purpose
