"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Users,
  Layers,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Server,
  Cpu,
  Ghost,
  BarChart3,
  PieChart,
  Target,
  Gauge,
  Info,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardHeader } from "@/components/dashboard/header";

// Monthly spend data by Project_Tag with environment breakdown
const monthlySpendDataByEnv = {
  all: [
    { month: "Jul", "fraud-detection": 12400, "customer-churn": 8200, "recommendation-engine": 15600, "nlp-pipeline": 9800, untagged: 3200 },
    { month: "Aug", "fraud-detection": 13100, "customer-churn": 8800, "recommendation-engine": 16200, "nlp-pipeline": 10400, untagged: 2900 },
    { month: "Sep", "fraud-detection": 14200, "customer-churn": 9100, "recommendation-engine": 17800, "nlp-pipeline": 11200, untagged: 3100 },
    { month: "Oct", "fraud-detection": 13800, "customer-churn": 9400, "recommendation-engine": 18400, "nlp-pipeline": 10800, untagged: 2800 },
    { month: "Nov", "fraud-detection": 15200, "customer-churn": 9800, "recommendation-engine": 19200, "nlp-pipeline": 11600, untagged: 3400 },
    { month: "Dec", "fraud-detection": 16400, "customer-churn": 10200, "recommendation-engine": 20100, "nlp-pipeline": 12400, untagged: 3600 },
  ],
  Production: [
    { month: "Jul", "fraud-detection": 8200, "customer-churn": 5400, "recommendation-engine": 10900, "nlp-pipeline": 6800, untagged: 1200 },
    { month: "Aug", "fraud-detection": 8700, "customer-churn": 5800, "recommendation-engine": 11400, "nlp-pipeline": 7200, untagged: 1100 },
    { month: "Sep", "fraud-detection": 9400, "customer-churn": 6000, "recommendation-engine": 12500, "nlp-pipeline": 7800, untagged: 1200 },
    { month: "Oct", "fraud-detection": 9100, "customer-churn": 6200, "recommendation-engine": 12900, "nlp-pipeline": 7500, untagged: 1000 },
    { month: "Nov", "fraud-detection": 10100, "customer-churn": 6500, "recommendation-engine": 13400, "nlp-pipeline": 8100, untagged: 1300 },
    { month: "Dec", "fraud-detection": 10900, "customer-churn": 6700, "recommendation-engine": 14100, "nlp-pipeline": 8700, untagged: 1400 },
  ],
  Staging: [
    { month: "Jul", "fraud-detection": 1800, "customer-churn": 1200, "recommendation-engine": 2100, "nlp-pipeline": 1400, untagged: 600 },
    { month: "Aug", "fraud-detection": 1900, "customer-churn": 1300, "recommendation-engine": 2200, "nlp-pipeline": 1500, untagged: 550 },
    { month: "Sep", "fraud-detection": 2100, "customer-churn": 1400, "recommendation-engine": 2400, "nlp-pipeline": 1600, untagged: 580 },
    { month: "Oct", "fraud-detection": 2000, "customer-churn": 1400, "recommendation-engine": 2500, "nlp-pipeline": 1550, untagged: 540 },
    { month: "Nov", "fraud-detection": 2200, "customer-churn": 1500, "recommendation-engine": 2600, "nlp-pipeline": 1650, untagged: 650 },
    { month: "Dec", "fraud-detection": 2400, "customer-churn": 1600, "recommendation-engine": 2700, "nlp-pipeline": 1750, untagged: 700 },
  ],
  Development: [
    { month: "Jul", "fraud-detection": 2000, "customer-churn": 1400, "recommendation-engine": 2200, "nlp-pipeline": 1400, untagged: 1200 },
    { month: "Aug", "fraud-detection": 2100, "customer-churn": 1500, "recommendation-engine": 2200, "nlp-pipeline": 1500, untagged: 1050 },
    { month: "Sep", "fraud-detection": 2300, "customer-churn": 1500, "recommendation-engine": 2500, "nlp-pipeline": 1600, untagged: 1120 },
    { month: "Oct", "fraud-detection": 2300, "customer-churn": 1600, "recommendation-engine": 2600, "nlp-pipeline": 1550, untagged: 1060 },
    { month: "Nov", "fraud-detection": 2500, "customer-churn": 1600, "recommendation-engine": 2800, "nlp-pipeline": 1650, untagged: 1250 },
    { month: "Dec", "fraud-detection": 2700, "customer-churn": 1700, "recommendation-engine": 2900, "nlp-pipeline": 1750, untagged: 1300 },
  ],
  Sandbox: [
    { month: "Jul", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
    { month: "Aug", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
    { month: "Sep", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
    { month: "Oct", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
    { month: "Nov", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
    { month: "Dec", "fraud-detection": 400, "customer-churn": 200, "recommendation-engine": 400, "nlp-pipeline": 200, untagged: 200 },
  ],
};

// Spend by user data - now with environment breakdown
const userSpendData = [
  { user: "sarah.chen@corp.com", spend: 18420, models: 12, trend: 8.2, department: "Data Science", env: "Production", devSpend: 4200, stagingSpend: 2100, prodSpend: 10120, sandboxSpend: 2000 },
  { user: "mike.johnson@corp.com", spend: 15680, models: 8, trend: -3.4, department: "ML Engineering", env: "Development", devSpend: 8400, stagingSpend: 3200, prodSpend: 2080, sandboxSpend: 2000 },
  { user: "lisa.wang@corp.com", spend: 14200, models: 15, trend: 12.1, department: "Data Science", env: "Production", devSpend: 2800, stagingSpend: 1400, prodSpend: 8500, sandboxSpend: 1500 },
  { user: "john.smith@corp.com", spend: 12450, models: 6, trend: 2.8, department: "Research", env: "Sandbox", devSpend: 2200, stagingSpend: 800, prodSpend: 1450, sandboxSpend: 8000 },
  { user: "emma.davis@corp.com", spend: 11890, models: 9, trend: -1.2, department: "ML Engineering", env: "Staging", devSpend: 3200, stagingSpend: 5890, prodSpend: 1800, sandboxSpend: 1000 },
  { user: "alex.kumar@corp.com", spend: 9840, models: 4, trend: 15.6, department: "Data Science", env: "Development", devSpend: 6200, stagingSpend: 1840, prodSpend: 1200, sandboxSpend: 600 },
  { user: "rachel.green@corp.com", spend: 8920, models: 7, trend: 5.3, department: "Research", env: "Production", devSpend: 1800, stagingSpend: 920, prodSpend: 5200, sandboxSpend: 1000 },
  { user: "david.lee@corp.com", spend: 7650, models: 5, trend: -8.1, department: "ML Engineering", env: "Development", devSpend: 4850, stagingSpend: 1200, prodSpend: 1100, sandboxSpend: 500 },
];

// Spend by Stage/Environment
const stageSpendData = [
  { name: "Production", value: 45200, color: "var(--chart-1)" },
  { name: "Staging", value: 12800, color: "var(--chart-2)" },
  { name: "Development", value: 28400, color: "var(--chart-3)" },
  { name: "Sandbox", value: 8600, color: "var(--chart-4)" },
];

// Cost per inference data - with environment
const costPerInferenceData = [
  { model: "GPT-4 Turbo", type: "LLM", costPer1k: 0.042, inferences: 2840000, totalCost: 11928, efficiency: "high", env: "Production" },
  { model: "Fraud Detection v3", type: "XGBoost", costPer1k: 0.0008, inferences: 45200000, totalCost: 3616, efficiency: "high", env: "Production" },
  { model: "Customer Churn", type: "RandomForest", costPer1k: 0.0012, inferences: 12400000, totalCost: 1488, efficiency: "medium", env: "Staging" },
  { model: "Embedding Model", type: "Transformer", costPer1k: 0.018, inferences: 8900000, totalCost: 16020, efficiency: "low", env: "Production" },
  { model: "Image Classifier", type: "CNN", costPer1k: 0.0045, inferences: 6200000, totalCost: 2790, efficiency: "medium", env: "Development" },
  { model: "Recommendation v2", type: "Neural CF", costPer1k: 0.0028, inferences: 34000000, totalCost: 9520, efficiency: "high", env: "Production" },
  { model: "Sentiment Analysis", type: "BERT", costPer1k: 0.025, inferences: 4100000, totalCost: 10250, efficiency: "low", env: "Development" },
  { model: "Anomaly Detector", type: "Autoencoder", costPer1k: 0.0015, inferences: 18600000, totalCost: 2790, efficiency: "high", env: "Staging" },
];

// Zombie resources data
const zombieResources = [
  { resource: "gpu-node-dev-042", type: "A100 GPU", env: "Dev", lastActive: "18 days ago", monthlyCost: 2840, mlflowRuns: 0 },
  { resource: "gpu-node-dev-038", type: "V100 GPU", env: "Dev", lastActive: "12 days ago", monthlyCost: 1420, mlflowRuns: 0 },
  { resource: "inference-endpoint-legacy", type: "CPU Cluster", env: "Staging", lastActive: "45 days ago", monthlyCost: 890, mlflowRuns: 0 },
  { resource: "training-cluster-exp", type: "A10G GPU", env: "Sandbox", lastActive: "32 days ago", monthlyCost: 1680, mlflowRuns: 0 },
  { resource: "embedding-service-old", type: "CPU Instance", env: "Dev", lastActive: "21 days ago", monthlyCost: 420, mlflowRuns: 0 },
];

// ROI comparison data
const roiData = [
  { initiative: "Fraud Detection", opCost: 16400, businessValue: 284000, roi: 1632, kpi: "Fraud Prevented ($)" },
  { initiative: "Customer Churn", opCost: 10200, businessValue: 156000, roi: 1429, kpi: "Retention Revenue ($)" },
  { initiative: "Recommendation", opCost: 20100, businessValue: 412000, roi: 1950, kpi: "Incremental Sales ($)" },
  { initiative: "NLP Pipeline", opCost: 12400, businessValue: 89000, roi: 618, kpi: "Hours Saved (x$50)" },
];

// Forecast data
const forecastData = [
  { month: "Jan", actual: null, forecast: 68200, lower: 62400, upper: 74000 },
  { month: "Feb", actual: null, forecast: 71400, lower: 64800, upper: 78000 },
  { month: "Mar", actual: null, forecast: 74800, lower: 67200, upper: 82400 },
  { month: "Apr", actual: null, forecast: 78200, lower: 69600, upper: 86800 },
  { month: "May", actual: null, forecast: 82400, lower: 72400, upper: 92400 },
  { month: "Jun", actual: null, forecast: 86800, lower: 75200, upper: 98400 },
];

// Cost center attribution
const costCenterData = [
  { costCenter: "CC-1001", projectTag: "fraud-detection", spend: 16400, percentage: 17.2 },
  { costCenter: "CC-1001", projectTag: "customer-churn", spend: 10200, percentage: 10.7 },
  { costCenter: "CC-1002", projectTag: "recommendation-engine", spend: 20100, percentage: 21.1 },
  { costCenter: "CC-1002", projectTag: "nlp-pipeline", spend: 12400, percentage: 13.0 },
  { costCenter: "CC-1003", projectTag: "image-classification", spend: 8400, percentage: 8.8 },
  { costCenter: "CC-1003", projectTag: "anomaly-detection", spend: 6200, percentage: 6.5 },
  { costCenter: "Unattributed", projectTag: "(no tag)", spend: 3600, percentage: 3.8 },
];

// Agent observability data
const agentSystemsData = [
  { 
    agent: "Customer Support Agent", 
    components: ["GPT-4", "RAG Pipeline", "Embedding Model", "Intent Classifier"],
    totalCost: 8420,
    latencyP99: 2.4,
    successRate: 94.2,
    dailyInvocations: 12400
  },
  { 
    agent: "Data Analysis Agent", 
    components: ["Claude-3", "Code Interpreter", "SQL Generator", "Chart Builder"],
    totalCost: 6280,
    latencyP99: 4.8,
    successRate: 91.8,
    dailyInvocations: 3200
  },
  { 
    agent: "Document Processing Agent", 
    components: ["OCR Model", "Layout Parser", "Entity Extractor", "Summarizer"],
    totalCost: 4650,
    latencyP99: 8.2,
    successRate: 96.4,
    dailyInvocations: 8900
  },
];

const monthlySpendData = monthlySpendDataByEnv.all;

// Environment mapping for zombie resources
const envMapping: Record<string, string> = {
  "Dev": "Development",
  "Development": "Development",
  "Staging": "Staging",
  "Sandbox": "Sandbox",
  "Production": "Production",
  "Prod": "Production",
};

export default function FinOpsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedCostCenter, setSelectedCostCenter] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState<"all" | "Production" | "Staging" | "Development" | "Sandbox">("all");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "inference" | "zombies" | "roi" | "agents">("overview");

  // Filtered monthly spend data based on environment
  const filteredMonthlySpendData = useMemo(() => {
    return monthlySpendDataByEnv[selectedEnv] || monthlySpendDataByEnv.all;
  }, [selectedEnv]);

  // Filtered user spend data
  const filteredUserSpendData = useMemo(() => {
    if (selectedEnv === "all") return userSpendData;
    return userSpendData.map((user) => {
      const envKey = selectedEnv === "Production" ? "prodSpend" : 
                     selectedEnv === "Staging" ? "stagingSpend" :
                     selectedEnv === "Development" ? "devSpend" : "sandboxSpend";
      return {
        ...user,
        spend: user[envKey as keyof typeof user] as number,
      };
    }).sort((a, b) => b.spend - a.spend);
  }, [selectedEnv]);

  // Filtered inference data
  const filteredInferenceData = useMemo(() => {
    if (selectedEnv === "all") return costPerInferenceData;
    return costPerInferenceData.filter((m) => m.env === selectedEnv);
  }, [selectedEnv]);

  // Filtered zombie resources
  const filteredZombieResources = useMemo(() => {
    if (selectedEnv === "all") return zombieResources;
    return zombieResources.filter((r) => envMapping[r.env] === selectedEnv);
  }, [selectedEnv]);

  const totalSpend = useMemo(() => {
    const data = filteredMonthlySpendData[filteredMonthlySpendData.length - 1];
    return data["fraud-detection"] +
      data["customer-churn"] +
      data["recommendation-engine"] +
      data["nlp-pipeline"] +
      data["untagged"];
  }, [filteredMonthlySpendData]);

  const zombieCostTotal = useMemo(() => {
    return filteredZombieResources.reduce((acc, r) => acc + r.monthlyCost, 0);
  }, [filteredZombieResources]);

  const avgCostPerInference = useMemo(() => {
    const data = filteredInferenceData;
    if (data.length === 0) return "0.0000";
    const totalCost = data.reduce((acc, m) => acc + m.totalCost, 0);
    const totalInferences = data.reduce((acc, m) => acc + m.inferences, 0);
    return (totalCost / totalInferences * 1000).toFixed(4);
  }, [filteredInferenceData]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="px-6 py-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">FinOps Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                AI/ML cost management, attribution, and optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Global Environment Filter */}
              <Select value={selectedEnv} onValueChange={(v) => setSelectedEnv(v as typeof selectedEnv)}>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <Layers className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Environment Filter Indicator */}
          {selectedEnv !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="bg-primary/10 text-primary border-primary/30 px-3 py-1 flex items-center gap-2"
              >
                <Layers className="h-3 w-3" />
                Filtered by: {selectedEnv}
                <button 
                  onClick={() => setSelectedEnv("all")}
                  className="ml-1 hover:bg-primary/20 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <span className="text-xs text-muted-foreground">
                Applies to: Spend Overview, By User, Cost per Inference, Zombie Resources
              </span>
            </div>
          )}

          {/* Summary KPIs */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total AI Spend (MTD)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ${totalSpend.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">+8.4%</span>
                      <span className="text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Avg Cost per 1K Inferences
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ${avgCostPerInference}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <TrendingDown className="h-3 w-3 text-accent" />
                      <span className="text-accent">-12.3%</span>
                      <span className="text-muted-foreground">optimized</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Zombie Resource Cost
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ${zombieCostTotal.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-warning">{zombieResources.length} resources</span>
                      <span className="text-muted-foreground">idle</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <Ghost className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Avg ROI (Production)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      1,407%
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <Target className="h-3 w-3 text-accent" />
                      <span className="text-accent">4 initiatives</span>
                      <span className="text-muted-foreground">tracked</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
            {[
              { id: "overview", label: "Spend Overview", icon: PieChart },
              { id: "users", label: "By User", icon: Users },
              { id: "inference", label: "Cost per Inference", icon: Zap },
              { id: "zombies", label: "Zombie Resources", icon: Ghost },
              { id: "roi", label: "ROI Analysis", icon: Target },
              { id: "agents", label: "Agent Systems", icon: Activity },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Monthly Spend by Project_Tag */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Monthly Spend by Project_Tag
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">BU Director: Monthly breakdown of AI spend across Project_Tags</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredMonthlySpendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <Area type="monotone" dataKey="fraud-detection" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="customer-churn" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="recommendation-engine" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="nlp-pipeline" stackId="1" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="untagged" stackId="1" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.6} />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Spend by Stage */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Spend by Env_Label
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">FinOps: R&D vs Production spend ratio</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={stageSpendData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {stageSpendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prod:R&D Ratio</span>
                      <span className="font-medium text-foreground">1.2:1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Target Ratio</span>
                      <span className="font-medium text-accent">1.5:1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Center Attribution */}
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      Cost Attribution by Cost_Center
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">FinOps: Total cost attribution across organization</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-3 text-left font-medium text-muted-foreground">Cost Center</th>
                          <th className="pb-3 text-left font-medium text-muted-foreground">Project_Tag</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">Spend</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {costCenterData.map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-3 font-mono text-xs text-foreground">{row.costCenter}</td>
                            <td className="py-3">
                              <Badge variant="outline" className="text-xs">
                                {row.projectTag}
                              </Badge>
                            </td>
                            <td className="py-3 text-right text-foreground">
                              ${row.spend.toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${row.percentage * 4}%` }}
                                  />
                                </div>
                                <span className="w-12 text-right text-muted-foreground">
                                  {row.percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Spend Forecast */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      6-Month Spend Forecast
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">BU Director: Forecast for fiscal year budgeting</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <Area type="monotone" dataKey="upper" stroke="transparent" fill="var(--chart-1)" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="lower" stroke="transparent" fill="var(--background)" fillOpacity={1} />
                        <Line type="monotone" dataKey="forecast" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Projected Q2 Total</span>
                    <span className="font-semibold text-foreground">$461,800</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground">
                    Spend by Individual User
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">BU Director: Track spend by user for coaching opportunities</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-medium text-muted-foreground">User</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Department</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Models</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Spend (MTD)</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUserSpendData.map((user, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {user.user.split(".")[0][0].toUpperCase()}
                                {user.user.split(".")[1][0].toUpperCase()}
                              </div>
                              <span className="font-medium text-foreground">{user.user}</span>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground">{user.department}</td>
                          <td className="py-4 text-right text-foreground">{user.models}</td>
                          <td className="py-4 text-right font-semibold text-foreground">
                            ${user.spend.toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <div className={`flex items-center justify-end gap-1 ${
                              user.trend > 10 ? "text-destructive" : user.trend < 0 ? "text-accent" : "text-muted-foreground"
                            }`}>
                              {user.trend > 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                              <span>{Math.abs(user.trend)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost per Inference Tab */}
          {activeTab === "inference" && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground">
                    Cost per Inference Analysis
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">FinOps/PM: Track cost per inference for optimization</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-medium text-muted-foreground">Model</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Type</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Environment</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Cost/1K Inferences</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Total Inferences</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Total Cost</th>
                        <th className="pb-3 text-center font-medium text-muted-foreground">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInferenceData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">
                            No models found for {selectedEnv} environment
                          </td>
                        </tr>
                      ) : filteredInferenceData.map((model, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-4 font-medium text-foreground">{model.model}</td>
                          <td className="py-4">
                            <Badge variant="outline" className="text-xs">
                              {model.type}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`text-xs ${
                                model.env === "Production"
                                  ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                                  : model.env === "Staging"
                                    ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                    : model.env === "Development"
                                      ? "bg-chart-3/20 text-chart-3 border-chart-3/30"
                                      : "bg-chart-4/20 text-chart-4 border-chart-4/30"
                              }`}
                            >
                              {model.env}
                            </Badge>
                          </td>
                          <td className="py-4 text-right font-mono text-foreground">
                            ${model.costPer1k.toFixed(4)}
                          </td>
                          <td className="py-4 text-right text-muted-foreground">
                            {(model.inferences / 1000000).toFixed(1)}M
                          </td>
                          <td className="py-4 text-right font-semibold text-foreground">
                            ${model.totalCost.toLocaleString()}
                          </td>
                          <td className="py-4 text-center">
                            <Badge
                              className={`text-xs ${
                                model.efficiency === "high"
                                  ? "bg-accent/20 text-accent border-accent/30"
                                  : model.efficiency === "medium"
                                    ? "bg-warning/20 text-warning border-warning/30"
                                    : "bg-destructive/20 text-destructive border-destructive/30"
                              }`}
                            >
                              {model.efficiency}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zombie Resources Tab */}
          {activeTab === "zombies" && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-foreground">
                      Zombie Resources Detection
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Idle resources with no active MLflow Runs
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Terminate All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-medium text-muted-foreground">Resource</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Type</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Environment</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Last Active</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">MLflow Runs</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Monthly Cost</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredZombieResources.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">
                            No zombie resources found for {selectedEnv} environment
                          </td>
                        </tr>
                      ) : filteredZombieResources.map((resource, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Ghost className="h-4 w-4 text-warning" />
                              <span className="font-mono text-xs text-foreground">{resource.resource}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`text-xs ${
                                resource.env === "Dev"
                                  ? "bg-chart-3/20 text-chart-3 border-chart-3/30"
                                  : resource.env === "Staging"
                                    ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                    : "bg-chart-4/20 text-chart-4 border-chart-4/30"
                              }`}
                            >
                              {resource.env}
                            </Badge>
                          </td>
                          <td className="py-4 text-warning">{resource.lastActive}</td>
                          <td className="py-4 text-right font-mono text-muted-foreground">
                            {resource.mlflowRuns}
                          </td>
                          <td className="py-4 text-right font-semibold text-destructive">
                            ${resource.monthlyCost.toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-warning/10 p-4 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Potential Monthly Savings</p>
                      <p className="text-xs text-muted-foreground">By terminating all zombie resources</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-warning">${zombieCostTotal.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ROI Analysis Tab */}
          {activeTab === "roi" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                      ROI Comparison by Initiative
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">BU Director: Operational costs vs business KPIs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roiData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <YAxis type="category" dataKey="initiative" stroke="var(--muted-foreground)" fontSize={12} width={120} />
                        <Bar dataKey="opCost" name="Operational Cost" fill="var(--chart-5)" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="businessValue" name="Business Value" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-3 text-left font-medium text-muted-foreground">Initiative</th>
                          <th className="pb-3 text-left font-medium text-muted-foreground">Business KPI</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">Op. Cost</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">Business Value</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roiData.map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-3 font-medium text-foreground">{row.initiative}</td>
                            <td className="py-3 text-muted-foreground">{row.kpi}</td>
                            <td className="py-3 text-right text-foreground">${row.opCost.toLocaleString()}</td>
                            <td className="py-3 text-right font-medium text-accent">${row.businessValue.toLocaleString()}</td>
                            <td className="py-3 text-right">
                              <Badge className="bg-accent/20 text-accent border-accent/30">
                                {row.roi}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Agent Systems Tab */}
          {activeTab === "agents" && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-foreground">
                      Agent-Based System Observability
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      End-to-end view of complex agent systems and their costs
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">SRE: Complete picture of app behavior and production costs</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentSystemsData.map((agent, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-foreground">{agent.agent}</h3>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {agent.components.map((comp, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View Traces
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Cost (MTD)</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            ${agent.totalCost.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Latency P99</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {agent.latencyP99}s
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className={`mt-1 text-lg font-semibold ${
                            agent.successRate >= 95 ? "text-accent" : agent.successRate >= 90 ? "text-warning" : "text-destructive"
                          }`}>
                            {agent.successRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Daily Invocations</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {(agent.dailyInvocations / 1000).toFixed(1)}K
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
