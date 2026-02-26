"use client";

import React from "react"

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  accentColor?: "primary" | "accent" | "warning";
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  accentColor = "primary",
}: KpiCardProps) {
  const accentClasses = {
    primary: "bg-primary/10 border-primary/20",
    accent: "bg-accent/10 border-accent/20",
    warning: "bg-warning/10 border-warning/20",
  };

  const valueClasses = {
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-warning",
  };

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card
      className={`${accentClasses[accentColor]} border transition-all hover:border-primary/40`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold tracking-tight ${valueClasses[accentColor]}`}
              >
                {value}
              </span>
              {trendValue && trend && (
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    trend === "up"
                      ? "text-accent"
                      : trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="rounded-lg bg-secondary p-2.5 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
