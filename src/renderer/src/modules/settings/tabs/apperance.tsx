import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { useDark } from "@renderer/hooks"
import { tipcClient } from "@renderer/lib/client"
import { getOS } from "@renderer/lib/utils"
import { uiActions, useUIStore } from "@renderer/store"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { SettingSwitch } from "../control"
import { SettingSectionTitle } from "../section"
import { SettingsTitle } from "../title"

export const SettingAppearance = () => {
  const { isDark, toggleDark } = useDark()
  const saveDarkSetting = useCallback(() => {
    toggleDark()
  }, [])

  const state = useUIStore()

  return (
    <div>
      <SettingsTitle />
      <SettingSectionTitle title="General" />
      <SettingSwitch
        label="Dark Mode"
        checked={isDark}
        onCheckedChange={saveDarkSetting}
      />
      {window.electron && getOS() === "macOS" && (
        <SettingSwitch
          label="Opaque Sidebars"
          checked={state.opaqueSidebar}
          onCheckedChange={(checked) => {
            uiActions.set("opaqueSidebar", checked)
          }}
        />
      )}

      <SettingSectionTitle title="Text" />
      {window.electron && <Fonts />}
      <TextSize />
    </div>
  )
}

const Fonts = () => {
  const { data } = useQuery({
    queryFn: () => tipcClient?.getSystemFonts(),
    queryKey: ["systemFonts"],
  })
  const readerFontFamily = useUIStore(
    (state) => state.readerFontFamily || "SN Pro",
  )
  return (
    <div className="-mt-1 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Font Family</span>
      <Select
        defaultValue="SN Pro"
        value={readerFontFamily}
        onValueChange={(value) => {
          uiActions.set("readerFontFamily", value)
        }}
      >
        <SelectTrigger className="h-8 w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="h-64">
          <SelectItem value="SN Pro">SN Pro</SelectItem>
          {data?.map((font) => (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const textSizeMap = {
  tiny: 12,
  smaller: 14,
  default: 16,
  medium: 18,
  large: 20,
}

const TextSize = () => {
  const uiTextSize = useUIStore((state) => state.uiTextSize)

  return (
    <div className="mt-1 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Text Size</span>
      <Select
        defaultValue={textSizeMap.default.toString()}
        value={uiTextSize.toString() || textSizeMap.default.toString()}
        onValueChange={(value) => {
          uiActions.set(
            "uiTextSize",
            Number.parseInt(value) || textSizeMap.default,
          )
        }}
      >
        <SelectTrigger className="h-8 w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(textSizeMap).map(([size, value]) => (
            <SelectItem key={size} value={value.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
