"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading"; // Import the Loading component
import {
  ArrowLeft,
  Activity,
  GitCommit,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Validation Funnel Data
const FUNNEL_STAGES = [
  {
    id: "development",
    name: "Development",
    count: 47,
    color: "bg-muted-foreground",
  },
  { id: "testing", name: "Testing", count: 32, color: "bg-chart-3" },
  { id: "validation", name: "Validation", count: 24, color: "bg-primary" },
  { id: "staging", name: "Staging", count: 18, color: "bg-chart-4" },
  { id: "production", name: "Production", count: 12, color: "bg-accent" },
];

// Service Health Data
const SERVICES = [
  {
    name: "Churn Predictor",
    endpoints: [
      { name: "predict", status: "healthy", latency: 45 },
      { name: "batch", status: "healthy", latency: 120 },
      { name: "retrain", status: "warning", latency: 890 },
    ],
  },
  {
    name: "Fraud Detection",
    endpoints: [
      { name: "score", status: "healthy", latency: 23 },
      { name: "explain", status: "healthy", latency: 67 },
      { name: "feedback", status: "healthy", latency: 34 },
    ],
  },
  {
    name: "Recommendation v3",
    endpoints: [
      { name: "recommend", status: "warning", latency: 156 },
      { name: "similar", status: "healthy", latency: 89 },
      { name: "personalize", status: "critical", latency: 2100 },
    ],
  },
  {
    name: "Revenue Forecast",
    endpoints: [
      { name: "forecast", status: "healthy", latency: 234 },
      { name: "scenario", status: "healthy", latency: 456 },
      { name: "refresh", status: "healthy", latency: 78 },
    ],
  },
  {
    name: "Anomaly Detection",
    endpoints: [
      { name: "detect", status: "healthy", latency: 12 },
      { name: "alert", status: "healthy", latency: 8 },
      { name: "analyze", status: "warning", latency: 567 },
    ],
  },
  {
    name: "Price Optimizer",
    endpoints: [
      { name: "optimize", status: "healthy", latency: 189 },
      { name: "simulate", status: "healthy", latency: 345 },
      { name: "apply", status: "healthy", latency: 23 },
    ],
  },
];

// Lineage & Audit Data
interface AuditRecord {
  id: string;
  modelName: string;
  version: string;
  riskCategory: "Critical" | "High" | "Medium" | "Low";
  trainingDataId: string;
  gitCommitHash: string;
  validationStatus: "Validated" | "Pending" | "Failed";
  lastValidated: string;
  technicalOwner: string;
  dataClassification: string;
}

const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: "1",
    modelName: "Customer Churn Predictor",
    version: "v2.4.1",
    riskCategory: "High",
    trainingDataId: "DS-2024-0892",
    gitCommitHash: "a1b2c3d4",
    validationStatus: "Validated",
    lastValidated: "2024-01-15",
    technicalOwner: "James Chen",
    dataClassification: "PII-Masked",
  },
  {
    id: "2",
    modelName: "Fraud Detection Engine",
    version: "v3.1.0",
    riskCategory: "Critical",
    trainingDataId: "DS-2024-1023",
    gitCommitHash: "e5f6g7h8",
    validationStatus: "Validated",
    lastValidated: "2024-01-18",
    technicalOwner: "Emily Watson",
    dataClassification: "Confidential",
  },
  {
    id: "3",
    modelName: "Recommendation System",
    version: "v3.0.2",
    riskCategory: "Medium",
    trainingDataId: "DS-2024-0756",
    gitCommitHash: "i9j0k1l2",
    validationStatus: "Pending",
    lastValidated: "2024-01-10",
    technicalOwner: "Lisa Park",
    dataClassification: "Internal",
  },
  {
    id: "4",
    modelName: "Revenue Forecasting",
    version: "v1.8.3",
    riskCategory: "Critical",
    trainingDataId: "DS-2024-0934",
    gitCommitHash: "m3n4o5p6",
    validationStatus: "Validated",
    lastValidated: "2024-01-20",
    technicalOwner: "Nina Patel",
    dataClassification: "Confidential",
  },
  {
    id: "5",
    modelName: "Anomaly Detection Pipeline",
    version: "v2.2.0",
    riskCategory: "Critical",
    trainingDataId: "DS-2024-1102",
    gitCommitHash: "q7r8s9t0",
    validationStatus: "Validated",
    lastValidated: "2024-01-19",
    technicalOwner: "Jessica White",
    dataClassification: "Internal",
  },
  {
    id: "6",
    modelName: "Price Optimization Engine",
    version: "v1.5.1",
    riskCategory: "High",
    trainingDataId: "DS-2024-0845",
    gitCommitHash: "u1v2w3x4",
    validationStatus: "Failed",
    lastValidated: "2024-01-12",
    technicalOwner: "Sophie Martinez",
    dataClassification: "Internal",
  },
  {
    id: "7",
    modelName: "NLP Ticket Classifier",
    version: "v2.0.0",
    riskCategory: "Medium",
    trainingDataId: "DS-2024-0623",
    gitCommitHash: "y5z6a7b8",
    validationStatus: "Validated",
    lastValidated: "2024-01-08",
    technicalOwner: "Amanda Garcia",
    dataClassification: "PII-Masked",
  },
  {
    id: "8",
    modelName: "User Segmentation Model",
    version: "v1.2.4",
    riskCategory: "Low",
    trainingDataId: "DS-2024-0512",
    gitCommitHash: "c9d0e1f2",
    validationStatus: "Pending",
    lastValidated: "2024-01-05",
    technicalOwner: "Ryan Clark",
    dataClassification: "Anonymized",
  },
];

function getStatusColor(
  status: string
): "healthy" | "warning" | "critical" | "default" {
  switch (status) {
    case "healthy":
      return "healthy";
    case "warning":
      return "warning";
    case "critical":
      return "critical";
    default:
      return "default";
  }
}

function getRiskBadgeVariant(
  risk: string
): "destructive" | "default" | "secondary" | "outline" {
  switch (risk) {
    case "Critical":
      return "destructive";
    case "High":
      return "default";
    case "Medium":
      return "secondary";
    default:
      return "outline";
  }
}

function getValidationIcon(status: string) {
  switch (status) {
    case "Validated":
      return <CheckCircle2 className="h-4 w-4 text-accent" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-warning" />;
    case "Failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
}

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [validationFilter, setValidationFilter] = useState<string[]>([]);
  const searchParams = useSearchParams(); // Use useSearchParams here

  const filteredRecords = useMemo(() => {
    return AUDIT_RECORDS.filter((record) => {
      const matchesSearch =
        searchQuery === "" ||
        record.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.gitCommitHash
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        record.trainingDataId
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesRisk =
        riskFilter.length === 0 || riskFilter.includes(record.riskCategory);
      const matchesValidation =
        validationFilter.length === 0 ||
        validationFilter.includes(record.validationStatus);
      return matchesSearch && matchesRisk && matchesValidation;
    });
  }, [searchQuery, riskFilter, validationFilter]);

  const totalInFunnel = FUNNEL_STAGES.reduce(
    (acc, stage) => acc + stage.count,
    0
  );

  const healthyCount = SERVICES.flatMap((s) => s.endpoints).filter(
    (e) => e.status === "healthy"
  ).length;
  const warningCount = SERVICES.flatMap((s) => s.endpoints).filter(
    (e) => e.status === "warning"
  ).length;
  const criticalCount = SERVICES.flatMap((s) => s.endpoints).filter(
    (e) => e.status === "critical"
  ).length;

  return (
    <TooltipProvider>
      <Suspense fallback={<Loading />}> {/* Wrap the main content in Suspense */}
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Registry
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Activity className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-foreground">
                      Operations Monitoring
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Model Lifecycle & Service Health
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Live
                </Badge>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Top Stats Row */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Models in Pipeline
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {totalInFunnel}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Services Healthy
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        {healthyCount}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        SLO Warnings
                      </p>
                      <p className="text-2xl font-bold text-warning">
                        {warningCount}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Critical Issues
                      </p>
                      <p className="text-2xl font-bold text-destructive">
                        {criticalCount}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Validation Funnel & Service Health Row */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              {/* Validation Funnel */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4 text-primary" />
                      Validation Funnel
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Model lifecycle progression through validation gates
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {FUNNEL_STAGES.map((stage, index) => {
                      const maxCount = Math.max(
                        ...FUNNEL_STAGES.map((s) => s.count)
                      );
                      const widthPercent = (stage.count / maxCount) * 100;

                      return (
                        <div key={stage.id} className="group">
                          <div className="mb-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {stage.name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {stage.count}
                            </span>
                          </div>
                          <div className="h-8 w-full overflow-hidden rounded-md bg-secondary/50">
                            <div
                              className={`h-full ${stage.color} transition-all duration-500 group-hover:opacity-80`}
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground">
                      Conversion Rate: Development → Production
                    </div>
                    <div className="text-sm font-semibold text-accent">25.5%</div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Health Heatmap */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Activity className="h-4 w-4 text-primary" />
                      Service Health (Latency SLO)
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-sm bg-accent" />
                        <span className="text-muted-foreground">
                          {"<"}100ms
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-sm bg-warning" />
                        <span className="text-muted-foreground">
                          {"<"}500ms
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-sm bg-destructive" />
                        <span className="text-muted-foreground">{">"}500ms</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SERVICES.map((service) => (
                      <div key={service.name} className="group">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                            {service.name}
                          </span>
                          <div className="flex items-center gap-1">
                            {service.endpoints.map((endpoint) => (
                              <Tooltip key={endpoint.name}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`h-6 w-6 rounded-sm cursor-pointer transition-all hover:scale-110 ${
                                      endpoint.status === "healthy"
                                        ? "bg-accent"
                                        : endpoint.status === "warning"
                                          ? "bg-warning"
                                          : "bg-destructive"
                                    }`}
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <div className="text-xs">
                                    <p className="font-medium">{endpoint.name}</p>
                                    <p className="text-muted-foreground">
                                      {endpoint.latency}ms latency
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground">
                      Overall SLO Compliance
                    </div>
                    <div className="text-sm font-semibold text-accent">94.4%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lineage & Audit Table */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <GitCommit className="h-4 w-4 text-primary" />
                      Lineage & Audit Trail
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Model provenance, data lineage, and validation evidence
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search models, commits, data IDs..."
                        className="h-9 w-64 bg-secondary pl-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-border bg-secondary"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          Risk Category
                          {riskFilter.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5"
                            >
                              {riskFilter.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["Critical", "High", "Medium", "Low"].map((risk) => (
                          <DropdownMenuCheckboxItem
                            key={risk}
                            checked={riskFilter.includes(risk)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setRiskFilter([...riskFilter, risk]);
                              } else {
                                setRiskFilter(
                                  riskFilter.filter((r) => r !== risk)
                                );
                              }
                            }}
                          >
                            {risk}
                          </DropdownMenuCheckboxItem>
                        ))}
                        {riskFilter.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setRiskFilter([])}
                              className="justify-center text-xs"
                            >
                              Clear
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-border bg-secondary"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Validation
                          {validationFilter.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5"
                            >
                              {validationFilter.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["Validated", "Pending", "Failed"].map((status) => (
                          <DropdownMenuCheckboxItem
                            key={status}
                            checked={validationFilter.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValidationFilter([...validationFilter, status]);
                              } else {
                                setValidationFilter(
                                  validationFilter.filter((s) => s !== status)
                                );
                              }
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {getValidationIcon(status)}
                              {status}
                            </span>
                          </DropdownMenuCheckboxItem>
                        ))}
                        {validationFilter.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setValidationFilter([])}
                              className="justify-center text-xs"
                            >
                              Clear
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Risk Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Training Data ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Git Commit Hash
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Validation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Data Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="group transition-colors hover:bg-secondary/20"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {record.modelName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {record.version}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={getRiskBadgeVariant(record.riskCategory)}
                              className="font-medium"
                            >
                              {record.riskCategory}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Database className="h-3.5 w-3.5 text-muted-foreground" />
                              <code className="rounded bg-secondary px-2 py-0.5 text-xs font-mono text-foreground">
                                {record.trainingDataId}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
                              <code className="rounded bg-secondary px-2 py-0.5 text-xs font-mono text-primary">
                                {record.gitCommitHash}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getValidationIcon(record.validationStatus)}
                              <span
                                className={`text-sm ${
                                  record.validationStatus === "Validated"
                                    ? "text-accent"
                                    : record.validationStatus === "Pending"
                                      ? "text-warning"
                                      : "text-destructive"
                                }`}
                              >
                                {record.validationStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {record.dataClassification}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {record.technicalOwner}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRecords.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No records match your filters
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery("");
                        setRiskFilter([]);
                        setValidationFilter([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </Suspense>
    </TooltipProvider>
  );
}
