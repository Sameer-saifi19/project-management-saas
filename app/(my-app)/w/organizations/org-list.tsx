"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export default function Orgpage({organizations}: {organizations: Organization[]}) {
  if (!organizations?.length) {
    return (
      <div className="text-muted-foreground">
        No organizations found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Card key={org.id} className="hover:shadow-md transition">
          <CardHeader>
            <h3 className="font-semibold text-lg">
              {org.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {org.slug}
            </p>
          </CardHeader>

          <CardContent>
            <p className="text-sm">
              {org.description || "No description"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
