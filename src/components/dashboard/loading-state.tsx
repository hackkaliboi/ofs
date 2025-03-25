import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingState() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[450px]" />
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[90px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart and Assets */}
        <div className="col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-9 w-9 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-[100px] mb-2" />
                        <Skeleton className="h-4 w-[70px]" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-[100px] mb-2" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="col-span-3 space-y-6">
          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array(4).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(4).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-[120px] mb-2" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-[100px] mb-2" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
