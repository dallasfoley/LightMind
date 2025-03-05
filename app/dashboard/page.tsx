import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavLinks from "@/components/dashboard/nav-links";
import { getUser } from "@/server/actions/users/getUser";
import { RecentSales } from "@/components/dashboard/recent-sales";
import Graph from "@/components/dashboard/graph";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="space-y-4">
      {user && <NavLinks user={user} />}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-2">
          <CardContent>{user && <Graph user={user} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardContent>
              <RecentSales />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
