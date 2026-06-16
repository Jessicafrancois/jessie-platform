'use client'

type ThemeSelectorProps = {
  theme: string
  setThemeAction: (
    value: string
  ) => void
}

export default function ThemeSelector({
  theme,
  setThemeAction,
}: ThemeSelectorProps) {

  return (

    <select
      className="theme-select"
      value={theme}
      onChange={(e) =>
        setThemeAction(
          e.target.value
        )
      }
    >
      <option value="system">
        System
      </option>

      <option value="dark">
        Dark
      </option>

      <option value="light">
        Light
      </option>
    </select>

  )

}