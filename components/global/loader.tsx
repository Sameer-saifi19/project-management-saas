import { Spinner } from "@/components/ui/spinner"

type LoaderProps = {
    text?: string
}

export default function Loader({text}: LoaderProps) {
  return (
    <div className="flex items-center gap-4">
        <Spinner data-icon="inline-start" />
        {text}
    </div>
  )
}
