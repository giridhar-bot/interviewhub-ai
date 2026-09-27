import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { adminRepository } from "@/repositories/admin.repository";

export const metadata = generateSEO({
  title: "User Management — Admin",
  description: "Manage users, roles, and permissions.",
  path: "/admin/users",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const roleColors: Record<string, string> = {
  USER: "bg-gray-100 text-gray-600",
  PREMIUM: "bg-violet-50 text-violet-600",
  MODERATOR: "bg-blue-50 text-blue-600",
  AUTHOR: "bg-cyan-50 text-cyan-600",
  ADMIN: "bg-red-50 text-red-600",
  SUPER_ADMIN: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-600",
  PENDING: "bg-yellow-50 text-yellow-600",
  SUSPENDED: "bg-red-50 text-red-600",
  DELETED: "bg-muted text-muted-foreground",
};

export default async function AdminUsersPage() {
  const [users, stats] = await Promise.all([
    adminRepository.getUserAdminList(),
    adminRepository.getUserAdminStats(),
  ]);

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
          { label: "Total Users", value: stats.total },
          { label: "Active Today", value: stats.activeToday },
          { label: "Premium", value: stats.premium },
          { label: "New This Week", value: stats.newThisWeek },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value.toLocaleString()}</CardTitle>
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
            {users.map((user) => {
              const status = user.bannedAt ? "SUSPENDED" : user.status;

              return (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{user.displayName ?? user.name ?? user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={roleColors[user.role] ?? ""}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[status] ?? ""}>{status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}</td>
                <td className="px-6 py-4 text-sm">{user.xp.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
              );
            })}
            {!users.length && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No user records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
