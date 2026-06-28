import { cn } from "@/lib/utils";

interface UserTableRow {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: Date | string;
}

interface UserTableProps {
  users: UserTableRow[];
  onRoleChange?: (id: string, role: string) => void;
  className?: string;
}

export function UserTable({ users, onRoleChange, className }: UserTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="bg-white dark:bg-gray-950">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {user.displayName}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
