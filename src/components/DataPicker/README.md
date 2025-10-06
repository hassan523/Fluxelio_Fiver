# DatePicker Component

A customizable date picker component that allows users to select month, year, and optionally a specific date.

## Features

- **Month and Year Selection**: Choose from a grid of months and years
- **Optional Day Selection**: Include day selection when needed
- **Quick Actions**: Current Month, Today, Previous, and Next buttons
- **Responsive Design**: Works well on different screen sizes
- **Dark Mode Support**: Compatible with dark/light themes
- **Accessibility**: Keyboard navigation and screen reader support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDateChange` | `(date: { month: number; year: number; day?: number }) => void` | Required | Callback function called when date selection changes |
| `initialDate` | `{ month: number; year: number; day?: number }` | Current date | Initial date to display |
| `includeDay` | `boolean` | `false` | Whether to include day selection |
| `placeholder` | `string` | `"Select Date"` | Placeholder text when no date is selected |
| `className` | `string` | `""` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the component is disabled |

## Usage

### Basic Usage (Month and Year only)

```tsx
import { DatePicker } from "@/components/DataPicker";

const MyComponent = () => {
  const handleDateChange = (date: { month: number; year: number; day?: number }) => {
    console.log("Selected:", date);
  };

  return (
    <DatePicker
      onDateChange={handleDateChange}
      placeholder="Select Month and Year"
    />
  );
};
```

### With Day Selection

```tsx
import { DatePicker } from "@/components/DataPicker";

const MyComponent = () => {
  const handleDateChange = (date: { month: number; year: number; day?: number }) => {
    console.log("Selected:", date);
  };

  return (
    <DatePicker
      onDateChange={handleDateChange}
      includeDay={true}
      placeholder="Select Date"
    />
  );
};
```

### With Initial Date

```tsx
import { DatePicker } from "@/components/DataPicker";

const MyComponent = () => {
  const handleDateChange = (date: { month: number; year: number; day?: number }) => {
    console.log("Selected:", date);
  };

  return (
    <DatePicker
      onDateChange={handleDateChange}
      initialDate={{ month: 5, year: 2024, day: 15 }}
      includeDay={true}
      placeholder="Select Date"
    />
  );
};
```

### Custom Styling

```tsx
import { DatePicker } from "@/components/DataPicker";

const MyComponent = () => {
  const handleDateChange = (date: { month: number; year: number; day?: number }) => {
    console.log("Selected:", date);
  };

  return (
    <DatePicker
      onDateChange={handleDateChange}
      className="w-64 border-blue-500"
      placeholder="Custom Styled Date Picker"
    />
  );
};
```

## Date Format

The component returns dates in the following format:

```typescript
{
  month: number;    // 0-11 (January = 0, December = 11)
  year: number;     // Full year (e.g., 2024)
  day?: number;     // 1-31 (only included if includeDay is true)
}
```

## Quick Actions

The component includes several quick action buttons:

- **Current Month**: Sets to the current month and year
- **Today**: Sets to today's date (month, year, and day)
- **Previous**: Moves to the previous month
- **Next**: Moves to the next month

## Styling

The component uses Tailwind CSS classes and is designed to work with your existing theme. It supports:

- Dark/light mode
- Custom border colors
- Responsive design
- Hover and focus states

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management 