import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "User Management — Admin",
  description: "Manage users, roles, and permissions.",
  path: "/admin/users",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const sampleUsers = [
  { id: "1", name: "Rahul Sharma", email: "rahul@example.com", role: "USER", status: "Active", joinDate: "2024-12-01", xp: 2450 },
  { id: "2", name: "Priya Patel", email: "priya@example.com", role: "PREMIUM", status: "Active", joinDate: "2024-11-15", xp: 5200 },
  { id: "3", name: "Amit Kumar", email: "amit@example.com", role: "MODERATOR", status: "Active", joinDate: "2024-10-20", xp: 8900 },
  { id: "4", name: "Sara Johnson", email: "sara@example.com", role: "USER", status: "Suspended", joinDate: "2024-09-05", xp: 120 },
  { id: "5", name: "Vikram Singh", email: "vikram@example.com", role: "ADMIN", status: "Active", joinDate: "2024-08-01", xp: 15000 },
];

const roleColors: Record<string, string> = {
  USER: "bg-gray-100 text-gray-600",
  PREMIUM: "bg-violet-50 text-violet-600",
  MODERATOR: "bg-blue-50 text-blue-600",
  ADMIN: "bg-red-50 text-red-600",
};

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-600",
  Suspended: "bg-red-50 text-red-600",
};

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="mt-1 text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export CSV</Button>
          <Button>Invite User</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "12,450", change: "+8.2%" },
          { label: "Active Today", value: "1,240", change: "+12%" },
          { label: "Premium", value: "890", change: "+5.3%" },
          { label: "New This Week", value: "156", change: "+22%" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl">{s.value}</CardTitle>
                <span className="text-xs font-medium text-green-600">{s.change}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">XP</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleUsers.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={roleColors[user.role]}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[user.status]}>{user.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinDate}</td>
                <td className="px-6 py-4 text-sm">{user.xp.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
