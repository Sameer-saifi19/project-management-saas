import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import { GoogleBtn } from "../_components/google-btn";

export default function Signin() {
  return (
    <>
      <div className="w-full max-w-sm ">
        <Card className="space-y-6">
          <CardHeader>
            <h1 className="text-2xl text-center">Sign in to continue</h1>
          </CardHeader>
          <CardContent>
              <GoogleBtn/>
          </CardContent>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up">Sign up</Link>
            </FieldDescription>
        </Card>
      </div>
    </>
  );
}
