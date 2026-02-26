"use client";

import React from "react";

import { useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  Box,
  Cpu,
  Database,
  Layers,
  Settings2,
  ExternalLink,
  Copy,
  Check,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types
interface ModelAsset {
  id: string;
  name: string;
  modelType: "LLM" | "XGBoost" | "RandomForest" | "NeuralNet" | "Transformer" | "Ensemble";
  validationStatus: "Validated" | "Pending" | "Failed";
  version: string;
  lastUpdated: string;
  baseModelId: string;
  resourceSpec: string;
  embeddingModel: string;
  description: string;
  owner: string;
  environment: "Production" | "Staging" | "Development";
  metrics: {
    accuracy?: number;
    latency?: number;
    throughput?: number;
  };
}

interface Initiative {
  id: string;
  friendlyName: string;
  businessOwner: string;
  technicalOwner: string;
  businessUnit: string;
}

// Sample initiative data (would come from API in production)
const INITIATIVES: Record<string, Initiative> = {
  "1": {
    id: "1",
    friendlyName: "Customer Churn Predictor",
    businessOwner: "Sarah Mitchell",
    technicalOwner: "James Chen",
    businessUnit: "Data Science",
  },
  "2": {
    id: "2",
    friendlyName: "Fraud Detection Engine",
    businessOwner: "Michael Rodriguez",
    technicalOwner: "Emily Watson",
    businessUnit: "Engineering",
  },
  "3": {
    id: "3",
    friendlyName: "Recommendation System v3",
    businessOwner: "David Kim",
    technicalOwner: "Lisa Park",
    businessUnit: "Product",
  },
  "4": {
    id: "4",
    friendlyName: "Inventory Optimizer",
    businessOwner: "Rachel Thompson",
    technicalOwner: "Alex Johnson",
    businessUnit: "Operations",
  },
  "5": {
    id: "5",
    friendlyName: "Revenue Forecasting Model",
    businessOwner: "Chris Anderson",
    technicalOwner: "Nina Patel",
    businessUnit: "Finance",
  },
  "6": {
    id: "6",
    friendlyName: "Campaign Attribution ML",
    businessOwner: "Jennifer Lee",
    technicalOwner: "Marcus Brown",
    businessUnit: "Marketing",
  },
  "7": {
    id: "7",
    friendlyName: "NLP Ticket Classifier",
    businessOwner: "Robert Taylor",
    technicalOwner: "Amanda Garcia",
    businessUnit: "Operations",
  },
  "8": {
    id: "8",
    friendlyName: "Price Optimization Engine",
    businessOwner: "Thomas Wilson",
    technicalOwner: "Sophie Martinez",
    businessUnit: "Finance",
  },
  "9": {
    id: "9",
    friendlyName: "User Segmentation Model",
    businessOwner: "Karen Davis",
    technicalOwner: "Ryan Clark",
    businessUnit: "Marketing",
  },
  "10": {
    id: "10",
    friendlyName: "Anomaly Detection Pipeline",
    businessOwner: "Daniel Moore",
    technicalOwner: "Jessica White",
    businessUnit: "Engineering",
  },
};

// Sample model assets per initiative
const generateAssetsForInitiative = (initiativeId: string): ModelAsset[] => {
  const baseAssets: ModelAsset[] = [
    {
      id: `${initiativeId}-001`,
      name: "Primary Prediction Model",
      modelType: "XGBoost",
      validationStatus: "Validated",
      version: "v2.4.1",
      lastUpdated: "2026-01-15",
      baseModelId: `base-xgb-${initiativeId}-prod`,
      resourceSpec: "ml.m5.2xlarge (8 vCPU, 32GB RAM)",
      embeddingModel: "text-embedding-3-large",
      description: "Core prediction model for primary use case classification and scoring",
      owner: "ML Platform Team",
      environment: "Production",
      metrics: { accuracy: 94.2, latency: 45, throughput: 1200 },
    },
    {
      id: `${initiativeId}-002`,
      name: "Feature Embedding Generator",
      modelType: "Transformer",
      validationStatus: "Validated",
      version: "v1.8.0",
      lastUpdated: "2026-01-10",
      baseModelId: `emb-tfm-${initiativeId}-v2`,
      resourceSpec: "ml.g4dn.xlarge (4 vCPU, 16GB RAM, T4 GPU)",
      embeddingModel: "sentence-transformers/all-mpnet-base-v2",
      description: "Generates dense vector embeddings for downstream model consumption",
      owner: "NLP Team",
      environment: "Production",
      metrics: { accuracy: 91.8, latency: 120, throughput: 450 },
    },
    {
      id: `${initiativeId}-003`,
      name: "Ensemble Aggregator",
      modelType: "Ensemble",
      validationStatus: "Pending",
      version: "v3.1.0-beta",
      lastUpdated: "2026-01-20",
      baseModelId: `ens-agg-${initiativeId}-stg`,
      resourceSpec: "ml.c5.4xlarge (16 vCPU, 32GB RAM)",
      embeddingModel: "N/A",
      description: "Aggregates predictions from multiple base models using weighted voting",
      owner: "ML Platform Team",
      environment: "Staging",
      metrics: { accuracy: 96.1, latency: 85, throughput: 800 },
    },
    {
      id: `${initiativeId}-004`,
      name: "Real-time Inference API",
      modelType: "LLM",
      validationStatus: "Validated",
      version: "v4.0.2",
      lastUpdated: "2026-01-18",
      baseModelId: `llm-inf-${initiativeId}-prod`,
      resourceSpec: "ml.p3.2xlarge (8 vCPU, 61GB RAM, V100 GPU)",
      embeddingModel: "openai/text-embedding-ada-002",
      description: "Large language model for natural language understanding and generation",
      owner: "GenAI Team",
      environment: "Production",
      metrics: { accuracy: 89.5, latency: 250, throughput: 200 },
    },
    {
      id: `${initiativeId}-005`,
      name: "Anomaly Detector",
      modelType: "NeuralNet",
      validationStatus: "Failed",
      version: "v1.2.3",
      lastUpdated: "2026-01-08",
      baseModelId: `anom-nn-${initiativeId}-dev`,
      resourceSpec: "ml.m5.xlarge (4 vCPU, 16GB RAM)",
      embeddingModel: "custom-autoencoder-v2",
      description: "Autoencoder-based anomaly detection for outlier identification",
      owner: "Data Science Team",
      environment: "Development",
      metrics: { accuracy: 78.3, latency: 35, throughput: 2000 },
    },
    {
      id: `${initiativeId}-006`,
      name: "Classification Forest",
      modelType: "RandomForest",
      validationStatus: "Validated",
      version: "v2.0.0",
      lastUpdated: "2026-01-12",
      baseModelId: `rf-cls-${initiativeId}-prod`,
      resourceSpec: "ml.c5.2xlarge (8 vCPU, 16GB RAM)",
      embeddingModel: "N/A",
      description: "Random forest classifier for categorical prediction tasks",
      owner: "ML Platform Team",
      environment: "Production",
      metrics: { accuracy: 92.7, latency: 25, throughput: 3500 },
    },
  ];
  return baseAssets;
};

const MODEL_TYPE_COLORS: Record<ModelAsset["modelType"], string> = {
  LLM: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  XGBoost: "bg-primary/20 text-primary border-primary/30",
  RandomForest: "bg-accent/20 text-accent border-accent/30",
  NeuralNet: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Transformer: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Ensemble: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const VALIDATION_STATUS_CONFIG: Record<
  ModelAsset["validationStatus"],
  { color: string; bgColor: string }
> = {
  Validated: { color: "bg-accent", bgColor: "bg-accent/20" },
  Pending: { color: "bg-warning", bgColor: "bg-warning/20" },
  Failed: { color: "bg-destructive", bgColor: "bg-destructive/20" },
};

function Loading() {
  return null;
}

export default function ModelLibraryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initiativeId = params.id as string;
  const initiative = INITIATIVES[initiativeId];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<ModelAsset | null>(null);
  const [modelTypeFilter, setModelTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const assets = useMemo(() => generateAssetsForInitiative(initiativeId), [initiativeId]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.baseModelId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = modelTypeFilter === "all" || asset.modelType === modelTypeFilter;
      const matchesStatus = statusFilter === "all" || asset.validationStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchQuery, modelTypeFilter, statusFilter]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!initiative) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Initiative Not Found</h1>
          <p className="mt-2 text-muted-foreground">The requested initiative could not be found.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Registry
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">{initiative.friendlyName}</h1>
              <p className="mt-2 text-xs text-muted-foreground">
                {initiative.businessUnit} &middot; {assets.length} Model Assets
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                {initiative.technicalOwner}
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Main Content */}
          <main className={cn("flex-1 p-6 transition-all", selectedAsset ? "mr-[400px]" : "")}>
            {/* Search and Filters Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search models by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary/50 pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={modelTypeFilter} onValueChange={setModelTypeFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary/50">
                    <SelectValue placeholder="Model Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="LLM">LLM</SelectItem>
                    <SelectItem value="XGBoost">XGBoost</SelectItem>
                    <SelectItem value="RandomForest">RandomForest</SelectItem>
                    <SelectItem value="NeuralNet">NeuralNet</SelectItem>
                    <SelectItem value="Transformer">Transformer</SelectItem>
                    <SelectItem value="Ensemble">Ensemble</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Validated">Validated</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-secondary/30 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", viewMode === "grid" && "bg-secondary")}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0", viewMode === "list" && "bg-secondary")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAssets.length} of {assets.length} assets
              </p>
            </div>

            {/* Asset Cards Grid */}
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    onClick={() => setSelectedAsset(asset)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <AssetListItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    onClick={() => setSelectedAsset(asset)}
                  />
                ))}
              </div>
            )}

            {filteredAssets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Box className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">No assets found</p>
                <p className="text-sm text-muted-foreground/70">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </main>

          {/* Specs Slide-out Pane */}
          {selectedAsset && (
            <aside className="fixed right-0 top-16 bottom-0 w-[400px] border-l border-border bg-card overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
                <h3 className="font-semibold text-foreground">Model Specifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAsset(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Model Header */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{selectedAsset.name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedAsset.description}</p>
                    </div>
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        VALIDATION_STATUS_CONFIG[selectedAsset.validationStatus].bgColor
                      )}
                    >
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          VALIDATION_STATUS_CONFIG[selectedAsset.validationStatus].color
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className={MODEL_TYPE_COLORS[selectedAsset.modelType]}>
                      {selectedAsset.modelType}
                    </Badge>
                    <Badge variant="outline" className="border-border bg-secondary/50">
                      {selectedAsset.version}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        selectedAsset.environment === "Production"
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : selectedAsset.environment === "Staging"
                            ? "border-warning/30 bg-warning/10 text-warning"
                            : "border-muted-foreground/30 bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedAsset.environment}
                    </Badge>
                  </div>
                </div>

                {/* Technical Metadata */}
                <div className="space-y-4">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Technical Specifications
                  </h5>

                  <SpecField
                    icon={<Database className="h-4 w-4" />}
                    label="Base_Model_ID"
                    value={selectedAsset.baseModelId}
                    onCopy={() => handleCopy(selectedAsset.baseModelId, "baseModelId")}
                    copied={copiedField === "baseModelId"}
                  />

                  <SpecField
                    icon={<Cpu className="h-4 w-4" />}
                    label="Resource_Spec"
                    value={selectedAsset.resourceSpec}
                    onCopy={() => handleCopy(selectedAsset.resourceSpec, "resourceSpec")}
                    copied={copiedField === "resourceSpec"}
                  />

                  <SpecField
                    icon={<Layers className="h-4 w-4" />}
                    label="Embedding_Model"
                    value={selectedAsset.embeddingModel}
                    onCopy={() => handleCopy(selectedAsset.embeddingModel, "embeddingModel")}
                    copied={copiedField === "embeddingModel"}
                  />
                </div>

                {/* Performance Metrics */}
                {selectedAsset.metrics && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Performance Metrics
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedAsset.metrics.accuracy !== undefined && (
                        <MetricCard label="Accuracy" value={`${selectedAsset.metrics.accuracy}%`} />
                      )}
                      {selectedAsset.metrics.latency !== undefined && (
                        <MetricCard label="Latency" value={`${selectedAsset.metrics.latency}ms`} />
                      )}
                      {selectedAsset.metrics.throughput !== undefined && (
                        <MetricCard label="Throughput" value={`${selectedAsset.metrics.throughput}/s`} />
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-4">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Additional Information
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner</span>
                      <span className="font-medium text-foreground">{selectedAsset.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium text-foreground">{selectedAsset.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset ID</span>
                      <span className="font-mono text-xs text-foreground">{selectedAsset.id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button className="flex-1 gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configure
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </Suspense>
  );
}

// Asset Card Component
function AssetCard({
  asset,
  isSelected,
  onClick,
}: {
  asset: ModelAsset;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-lg border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        isSelected ? "border-primary ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{asset.name}</h4>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
        </div>
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            VALIDATION_STATUS_CONFIG[asset.validationStatus].bgColor
          )}
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              VALIDATION_STATUS_CONFIG[asset.validationStatus].color
            )}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", MODEL_TYPE_COLORS[asset.modelType])}>
          {asset.modelType}
        </Badge>
        <Badge variant="outline" className="text-xs border-border bg-secondary/50 text-muted-foreground">
          {asset.version}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{asset.environment}</span>
        <span>{asset.lastUpdated}</span>
      </div>
    </button>
  );
}

// Asset List Item Component
function AssetListItem({
  asset,
  isSelected,
  onClick,
}: {
  asset: ModelAsset;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-lg border bg-card px-4 py-3 text-left transition-all hover:border-primary/50",
        isSelected ? "border-primary ring-1 ring-primary" : "border-border"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          VALIDATION_STATUS_CONFIG[asset.validationStatus].bgColor
        )}
      >
        <div
          className={cn(
            "h-3 w-3 rounded-full",
            VALIDATION_STATUS_CONFIG[asset.validationStatus].color
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-foreground truncate">{asset.name}</h4>
          <Badge variant="outline" className={cn("text-xs shrink-0", MODEL_TYPE_COLORS[asset.modelType])}>
            {asset.modelType}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{asset.baseModelId}</p>
      </div>

      <div className="shrink-0 text-right">
        <Badge variant="outline" className="text-xs border-border bg-secondary/50">
          {asset.version}
        </Badge>
        <p className="mt-1 text-xs text-muted-foreground">{asset.environment}</p>
      </div>
    </button>
  );
}

// Spec Field Component
function SpecField({
  icon,
  label,
  value,
  onCopy,
  copied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <code className="flex-1 truncate font-mono text-sm text-foreground">{value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="h-7 w-7 shrink-0 p-0"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
