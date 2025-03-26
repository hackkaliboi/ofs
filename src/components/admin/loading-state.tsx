import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLoadingStateProps {
  message?: string;
}

export function AdminLoadingState({ message = "Loading..." }: AdminLoadingStateProps) {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 shadow-sm">
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

      {/* Loading Message */}
      <div className="text-center text-muted-foreground">
        <p>{message}</p>
      </div>

      {/* Key Metrics Skeleton */}
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

      {/* Blockchain Monitoring Skeleton */}
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="flex space-x-2">
            {Array(3).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-md" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Prices and Smart Contracts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Token Prices Skeleton */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(4).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center py-2 border-b border-muted last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-[50px] mb-1" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[60px] justify-self-end" />
                  <Skeleton className="h-6 w-[70px] justify-self-end" />
                  <Skeleton className="h-4 w-[50px] justify-self-end" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Contracts Skeleton */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-[180px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(3).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section Skeleton */}
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex space-x-2">
            {Array(3).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-md" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
