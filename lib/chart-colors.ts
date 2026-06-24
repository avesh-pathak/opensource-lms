/**
 * Centralized chart color configuration
 * Maintains consistent orange color scheme across all admin analytics charts
 */

export const CHART_COLORS = {
  primary: '#f97316', // orange-500 - Primary brand color
  secondary: '#fb923c', // orange-400 - Secondary variant
  tertiary: '#fdba74', // orange-300 - Tertiary variant
  light1: '#fed7aa', // orange-200
  light2: '#ffedd5', // orange-100
  light3: '#fef3c7', // amber-100
  light4: '#fde68a', // amber-200
  light5: '#fcd34d', // amber-300
} as const

/**
 * Orange palette for multi-series charts
 */
export const ORANGE_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.light1,
  CHART_COLORS.light2,
] as const

/**
 * Extended palette for charts with many categories
 */
export const EXTENDED_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.light1,
  CHART_COLORS.light2,
  CHART_COLORS.light3,
  CHART_COLORS.light4,
  CHART_COLORS.light5,
] as const

/**
 * Device-specific colors for web analytics
 */
export const DEVICE_COLORS = {
  desktop: '#3b82f6', // blue-500
  mobile: '#22c55e', // green-500
  tablet: CHART_COLORS.primary,
} as const

/**
 * General purpose color array for mixed charts
 */
export const MIXED_COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  CHART_COLORS.primary, // orange
  '#a855f7', // purple
  '#ec4899', // pink
] as const
