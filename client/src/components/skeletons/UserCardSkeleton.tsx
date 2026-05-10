import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserCardSkeleton({length = 7}) {
  return (
    <div className="w-full  max-w-sm space-y-4">
      {Array.from({ length }).map((_, i) => (
        <Card key={i} className="w-full rounded-2xl shadow-md">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-3">
              {/* Username */}
              <Skeleton className="h-5 w-32 bg-primary/10" />

              {/* Badge */}
              <Skeleton className="h-6 w-20 rounded-full bg-primary/10" />
            </div>

            {/* Button */}
            <Skeleton className="h-10 w-28 rounded-md bg-primary/10" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
