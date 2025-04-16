"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  Key,
  Layers,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "~/lib/apiRequest";
import { type Role, type User } from "~/types";

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<{
    users: number;
    roles: number;
    permissions: number;
  }>({
    users: 0,
    roles: 0,
    permissions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<Partial<User>[]>([]);
  const [topRoles, setTopRoles] = useState<Partial<Role>[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch aggregated stats
        const usersData = await fetchData("/xusers");
        const rolesData = await fetchData("/roles");
        const permissionsData = await fetchData("/permissions");

        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          roles: Array.isArray(rolesData) ? rolesData.length : 0,
          permissions: Array.isArray(permissionsData)
            ? permissionsData.length
            : 0,
        });

        // Fetch recent users
        if (Array.isArray(usersData) && usersData.length > 0) {
          // Sort users by creation date if available or just take the first few
          const recent = usersData.slice(0, 5);
          setRecentUsers(recent);
        }

        // Set top roles based on hierarchy
        if (Array.isArray(rolesData) && rolesData.length > 0) {
          // Get top-level roles (those without parents)
          const topLevelRoles = rolesData
            .filter((role) => !role.parentId)
            .slice(0, 5);
          setTopRoles(topLevelRoles);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats: DashboardStat[] = [
    {
      title: "Total Users",
      value: stats.users,
      description: "Active users in your system",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      link: "/admin/users",
    },
    {
      title: "Roles",
      value: stats.roles,
      description: "Defined user roles",
      icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
      link: "/admin/roles",
    },
    {
      title: "Permissions",
      value: stats.permissions,
      description: "System permissions",
      icon: <Key className="h-5 w-5 text-amber-600" />,
      link: "/admin/permissions",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Monitor and manage your application's security and user access.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Link
            href={stat.link || "#"}
            key={index}
            className="transition-transform hover:-translate-y-1"
          >
            <Card className="border-gray-200 shadow-sm hover:shadow-md dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </div>
                <CardDescription>{stat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="h-9 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[200px] items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Settings className="mx-auto h-10 w-10 animate-spin opacity-30" />
                      <p className="mt-4">Activity data coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
                        ></div>
                      ))}
                    </div>
                  ) : recentUsers.length > 0 ? (
                    <ul className="space-y-2">
                      {recentUsers.map((user) => (
                        <li
                          key={user.id}
                          className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                              {user.email?.[0].toUpperCase() || "U"}
                            </div>
                            <span className="font-medium">{user.email}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-[150px] items-center justify-center text-gray-500 dark:text-gray-400">
                      <p>No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserCog className="h-5 w-5 text-indigo-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage your system users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                ) : recentUsers.length > 0 ? (
                  <div className="rounded-md border dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                          >
                            User
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                          >
                            Roles
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {recentUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                  {user.email?.[0].toUpperCase() || "U"}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {user.roles && user.roles.length > 0
                                ? user.roles
                                    .map((role: any) => role.name)
                                    .join(", ")
                                : "No roles assigned"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  Role Overview
                </CardTitle>
                <CardDescription>View and manage system roles</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                ) : topRoles.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {topRoles.map((role) => (
                      <Card
                        key={role.id}
                        className="border-gray-200 hover:shadow-md dark:border-gray-700"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium">
                            {role.name}
                          </CardTitle>
                          <CardDescription>
                            {role.description || "No description available"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Link
                            href="/admin/roles"
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Manage role
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>No roles found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
