// 統一的顏色主題系統
export const COLOR_THEMES = {
  label: {
    gray: {
      bg: 'bg-gray-2',
      text: 'text-gray-8',
      border: 'border-gray-3',
      dot: 'bg-gray-5',
    },
    yellow: {
      bg: 'bg-yellow-1',
      text: 'text-yellow-9',
      border: 'border-yellow-2',
      dot: 'bg-yellow-7',
    },
    red: {
      bg: 'bg-red-1',
      text: 'text-red-9',
      border: 'border-red-2',
      dot: 'bg-red-7',
    },
    dark: {
      bg: 'bg-gray-6',
      text: 'text-white',
      border: 'border-gray-6',
      dot: 'bg-gray-4',
    },
    blue: {
      bg: 'bg-blue-7',
      text: 'text-white',
      border: 'border-blue-7',
      dot: 'bg-blue-4',
    },
    green: {
      bg: 'bg-green-1',
      text: 'text-green-9',
      border: 'border-green-2',
      dot: 'bg-green-7',
    },
  },

  progress: {
    orange: {
      bg: 'bg-[#D97706]',
      text: 'text-[#D97706]',
      border: 'border-[#D97706]',
      dot: 'bg-[#D97706]',
    },
    red: {
      bg: 'bg-[#DC2626]',
      text: 'text-[#DC2626]',
      border: 'border-[#DC2626]',
      dot: 'bg-[#DC2626]',
    },
    yellow: {
      bg: 'bg-yellow-7',
      text: 'text-yellow-7',
      border: 'border-yellow-7',
      dot: 'bg-yellow-7',
    },
    green: {
      bg: 'bg-green-7',
      text: 'text-green-7',
      border: 'border-green-7',
      dot: 'bg-green-7',
    },
  },
} as const

export type ColorTheme = {
  bg: string
  text: string
  border: string
  dot: string
}
export type LabelTheme =
  (typeof COLOR_THEMES.label)[keyof typeof COLOR_THEMES.label]
export type ProgressTheme =
  (typeof COLOR_THEMES.progress)[keyof typeof COLOR_THEMES.progress]
