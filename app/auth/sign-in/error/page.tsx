import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <CardTitle className="text-2xl font-semibold">
            Error while sign in
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            We couldn&apos;t complete your sign-in. Please try again.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">
              Try again
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Go to homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
