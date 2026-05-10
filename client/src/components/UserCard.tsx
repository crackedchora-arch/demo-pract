import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  name: string;
  active: boolean;
  onToggle: () => void;
};

export default function UserCard({
  name,
  active,
  onToggle,
}: UserCardProps) {
  return (
    <Card className="w-full bg-card max-w-sm rounded-2xl shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{name}</h2>

          <Badge
            className={
              active
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Button onClick={onToggle} variant="outline" className="w-30">
          Set {active ? "Inactive" : "Active"}
        </Button>
      </CardContent>
    </Card>
  );
}
