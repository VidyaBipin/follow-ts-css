import { useMe } from "@renderer/atoms/user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useAuthQuery } from "@renderer/hooks/common"
import { Queries } from "@renderer/queries"
import { useEntryReadHistory } from "@renderer/store/entry"
import { useUserById } from "@renderer/store/user"
import { Fragment } from "react"

import { usePresentUserProfileModal } from "../profile/hooks"

export const EntryReadHistory: Component<{ entryId: string }> = ({
  entryId,
}) => {
  const me = useMe()
  const entryHistory = useEntryReadHistory(entryId)

  useAuthQuery(Queries.entries.entryReadingHistory(entryId), {
    refetchInterval: 1000 * 60,
  })

  if (!entryHistory) return null
  if (!me) return null
  if (!entryHistory.userIds) return null

  return (
    <div className="flex items-center">
      {entryHistory.userIds
        .filter((id) => id !== me?.id)
        .slice(0, 10)

        .map((userId, i) => (
          <Fragment key={userId}>
            <EntryUser userId={userId} i={i} />
          </Fragment>
        ))}

      {entryHistory.readCount &&
        entryHistory.readCount > 10 &&
        entryHistory.userIds &&
        entryHistory.userIds.length >= 10 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              style={{
                right: "80px",
                zIndex: 11,
              }}
              className="relative z-[11] flex size-8 items-center justify-center rounded-full border border-border bg-muted ring ring-background"
            >
              <span className="text-[10px] font-medium text-muted-foreground">
                +
                {Math.min(entryHistory.readCount - 10, 99)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">More</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

const EntryUser: Component<{
  userId: string
  i: number
}> = ({ userId, i }) => {
  const user = useUserById(userId)
  const presentUserProfile = usePresentUserProfileModal()
  if (!user) return null
  return (
    <Tooltip>
      <TooltipTrigger
        className="relative"
        style={{
          right: `${i * 8}px`,
          zIndex: i,
        }}
      >
        <button
          className="no-drag-region cursor-pointer"
          type="button"
          onClick={() => {
            presentUserProfile(userId)
          }}
        >
          <Avatar className="aspect-square size-7 border border-border ring-1 ring-background">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        Recent reader:
        {user.name}
      </TooltipContent>
    </Tooltip>
  )
}
