import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingState() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex flex-col md:items-end">
            <Skeleton className="h-8 w-[150px]" />
            <div className="flex items-center mt-2">
              <Skeleton className="h-5 w-[80px] mr-2" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          "from-blue-50 to-indigo-50",
          "from-green-50 to-emerald-50",
          "from-amber-50 to-yellow-50",
          "from-purple-50 to-violet-50"
        ].map((gradient, i) => (
          <Card key={i} className={`overflow-hidden border-none shadow-md bg-gradient-to-br ${gradient}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[90px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex space-x-2">
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-8 w-12 rounded-md" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="mt-4 flex items-center justify-between">
            {Array(3).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-4 w-[100px]" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assets and Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Assets Skeleton */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-9 w-[100px] rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 rounded-full">
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-[100px] mb-2" />
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-[70px] mr-2" />
                        <Skeleton className="h-5 w-[40px] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-[80px] mb-2" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Skeleton */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
            <Skeleton className="h-9 w-[120px] rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-full bg-blue-100">
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-[120px] mb-2" />
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-[80px] mr-2" />
                        <Skeleton className="h-5 w-[60px] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-[80px] mb-2" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          "bg-gradient-to-br from-indigo-500/30 to-purple-600/30",
          "bg-gradient-to-br from-green-500/30 to-emerald-600/30",
          "bg-white border-2 border-gray-200",
          "bg-white border-2 border-gray-200"
        ].map((bg, i) => (
          <Skeleton
            key={i}
            className={`h-24 rounded-lg ${bg}`}
          />
        ))}
      </div>
    </div>
  );
}
