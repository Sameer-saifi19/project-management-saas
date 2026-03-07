import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
<<<<<<< HEAD
      className={cn("bg-muted rounded-md animate-pulse", className)}
=======
      className={cn("animate-pulse rounded-md bg-accent", className)}
>>>>>>> prod
      {...props}
    />
  )
}

export { Skeleton }
