import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import NavLinks from "@/components/dashboard/nav-links";
import { getUser } from "@/server/actions/getUser";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="space-y-4">
      {user && <NavLinks user={user} />}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
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
