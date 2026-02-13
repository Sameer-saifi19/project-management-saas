import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
            <h1 className="text-2xl text-center">Sign up to project Saas</h1>
          </CardHeader>
          <CardContent>
              <GoogleBtn signUp/>
          </CardContent>
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link href="/auth/sign-in">Sign in</Link>
            </FieldDescription>
        </Card>
      </div>
    </>
  );
}
