"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Database,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { FilterSidebar } from "@/components/dashboard/filter-sidebar";
import {
  AccountabilityMatrix,
  type Project,
} from "@/components/dashboard/accountability-matrix";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Sample data
const BUSINESS_UNITS = [
  "Data Science",
  "Engineering",
  "Product",
  "Operations",
  "Finance",
  "Marketing",
];

const RISK_TIERS = ["Critical", "High", "Medium", "Low"];

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    friendlyName: "Customer Churn Predictor",
    businessOwner: "Sarah Mitchell",
    businessOwnerEmail: "s.mitchell@company.com",
    technicalOwner: "James Chen",
    technicalOwnerEmail: "j.chen@company.com",
    businessUnit: "Data Science",
    riskTier: "High",
    status: "Active",
    completeness: 94,
  },
  {
    id: "2",
    friendlyName: "Fraud Detection Engine",
    businessOwner: "Michael Rodriguez",
    businessOwnerEmail: "m.rodriguez@company.com",
    technicalOwner: "Emily Watson",
    technicalOwnerEmail: "e.watson@company.com",
    businessUnit: "Engineering",
    riskTier: "Critical",
    status: "Active",
    completeness: 88,
  },
  {
    id: "3",
    friendlyName: "Recommendation System v3",
    businessOwner: "David Kim",
    businessOwnerEmail: "d.kim@company.com",
    technicalOwner: "Lisa Park",
    technicalOwnerEmail: "l.park@company.com",
    businessUnit: "Product",
    riskTier: "Medium",
    status: "In Review",
    completeness: 76,
  },
  {
    id: "4",
    friendlyName: "Inventory Optimizer",
    businessOwner: "Rachel Thompson",
    businessOwnerEmail: "r.thompson@company.com",
    technicalOwner: "Alex Johnson",
    technicalOwnerEmail: "a.johnson@company.com",
    businessUnit: "Operations",
    riskTier: "High",
    status: "Active",
    completeness: 92,
  },
  {
    id: "5",
    friendlyName: "Revenue Forecasting Model",
    businessOwner: "Chris Anderson",
    businessOwnerEmail: "c.anderson@company.com",
    technicalOwner: "Nina Patel",
    technicalOwnerEmail: "n.patel@company.com",
    businessUnit: "Finance",
    riskTier: "Critical",
    status: "Active",
    completeness: 85,
  },
  {
    id: "6",
    friendlyName: "Campaign Attribution ML",
    businessOwner: "Jennifer Lee",
    businessOwnerEmail: "j.lee@company.com",
    technicalOwner: "Marcus Brown",
    technicalOwnerEmail: "m.brown@company.com",
    businessUnit: "Marketing",
    riskTier: "Low",
    status: "Active",
    completeness: 98,
  },
  {
    id: "7",
    friendlyName: "NLP Ticket Classifier",
    businessOwner: "Robert Taylor",
    businessOwnerEmail: "r.taylor@company.com",
    technicalOwner: "Amanda Garcia",
    technicalOwnerEmail: "a.garcia@company.com",
    businessUnit: "Operations",
    riskTier: "Medium",
    status: "Archived",
    completeness: 100,
  },
  {
    id: "8",
    friendlyName: "Price Optimization Engine",
    businessOwner: "Thomas Wilson",
    businessOwnerEmail: "t.wilson@company.com",
    technicalOwner: "Sophie Martinez",
    technicalOwnerEmail: "s.martinez@company.com",
    businessUnit: "Finance",
    riskTier: "High",
    status: "Active",
    completeness: 79,
  },
  {
    id: "9",
    friendlyName: "User Segmentation Model",
    businessOwner: "Karen Davis",
    businessOwnerEmail: "k.davis@company.com",
    technicalOwner: "Ryan Clark",
    technicalOwnerEmail: "r.clark@company.com",
    businessUnit: "Marketing",
    riskTier: "Low",
    status: "In Review",
    completeness: 67,
  },
  {
    id: "10",
    friendlyName: "Anomaly Detection Pipeline",
    businessOwner: "Daniel Moore",
    businessOwnerEmail: "d.moore@company.com",
    technicalOwner: "Jessica White",
    technicalOwnerEmail: "j.white@company.com",
    businessUnit: "Engineering",
    riskTier: "Critical",
    status: "Active",
    completeness: 91,
  },
];

const completenessData = [
  { value: 72 },
  { value: 75 },
  { value: 78 },
  { value: 76 },
  { value: 80 },
  { value: 82 },
  { value: 85 },
  { value: 87 },
];

const assetsData = [
  { value: 120 },
  { value: 125 },
  { value: 128 },
  { value: 132 },
  { value: 138 },
  { value: 142 },
  { value: 145 },
  { value: 147 },
];

const reuseData = [
  { value: 2.1 },
  { value: 2.3 },
  { value: 2.2 },
  { value: 2.5 },
  { value: 2.6 },
  { value: 2.8 },
  { value: 2.9 },
  { value: 3.2 },
];

const trendChartData = [
  { month: "Aug", completeness: 72, assets: 120 },
  { month: "Sep", completeness: 75, assets: 128 },
  { month: "Oct", completeness: 78, assets: 132 },
  { month: "Nov", completeness: 82, assets: 138 },
  { month: "Dec", completeness: 85, assets: 142 },
  { month: "Jan", completeness: 87, assets: 147 },
];

export default function DashboardPage() {
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState<string[]>(
    []
  );
  const [selectedRiskTiers, setSelectedRiskTiers] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedBusinessUnits([]);
    setSelectedRiskTiers([]);
  };

  const filteredProjects = useMemo(() => {
    return SAMPLE_PROJECTS.filter((project) => {
      const matchesBusinessUnit =
        selectedBusinessUnits.length === 0 ||
        selectedBusinessUnits.includes(project.businessUnit);
      const matchesRiskTier =
        selectedRiskTiers.length === 0 ||
        selectedRiskTiers.includes(project.riskTier);
      return matchesBusinessUnit && matchesRiskTier;
    });
  }, [selectedBusinessUnits, selectedRiskTiers]);

  const avgCompleteness = useMemo(() => {
    if (filteredProjects.length === 0) return 0;
    const sum = filteredProjects.reduce((acc, p) => acc + p.completeness, 0);
    return Math.round(sum / filteredProjects.length);
  }, [filteredProjects]);

  const productionAssets = filteredProjects.filter(
    (p) => p.status === "Active"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />

      <div className="flex flex-1">
        <FilterSidebar
          businessUnits={BUSINESS_UNITS}
          riskTiers={RISK_TIERS}
          selectedBusinessUnits={selectedBusinessUnits}
          selectedRiskTiers={selectedRiskTiers}
          onBusinessUnitChange={setSelectedBusinessUnits}
          onRiskTierChange={setSelectedRiskTiers}
          onReset={handleReset}
        />

        <main className="flex-1 overflow-auto p-6">
          {/* KPI Cards Row */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              title="Registry Completeness"
              value={`${avgCompleteness}%`}
              subtitle="Documentation score"
              trend="up"
              trendValue="+2.4%"
              accentColor="primary"
              icon={<PieChart className="h-5 w-5" />}
            />
            <KpiCard
              title="Total Production Assets"
              value={productionAssets}
              subtitle="Active ML systems"
              trend="up"
              trendValue="+5"
              accentColor="accent"
              icon={<Database className="h-5 w-5" />}
            />
            <KpiCard
              title="Reuse Index"
              value="3.2x"
              subtitle="Avg component reuse"
              trend="up"
              trendValue="+0.4x"
              accentColor="warning"
              icon={<RefreshCw className="h-5 w-5" />}
            />
          </div>

          {/* Trend Charts Row */}
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Registry Completeness Trend
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                >
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendChartData}>
                      <defs>
                        <linearGradient
                          id="completenessGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--primary)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--primary)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        domain={[60, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "var(--foreground)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completeness"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fill="url(#completenessGradient)"
                        name="Completeness"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">
                      Completeness Score
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Asset Growth
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                >
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendChartData}>
                      <defs>
                        <linearGradient
                          id="assetsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--accent)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--accent)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        domain={[100, 160]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "var(--foreground)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="assets"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        fill="url(#assetsGradient)"
                        name="Assets"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <span className="text-xs text-muted-foreground">
                      Production Assets
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accountability Matrix Table */}
          <AccountabilityMatrix data={filteredProjects} />
        </main>
      </div>
    </div>
  );
}
