"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface Project {
  id: string;
  friendlyName: string;
  businessOwner: string;
  businessOwnerEmail: string;
  technicalOwner: string;
  technicalOwnerEmail: string;
  businessUnit: string;
  riskTier: "Critical" | "High" | "Medium" | "Low";
  status: "Active" | "In Review" | "Archived";
  completeness: number;
}

interface AccountabilityMatrixProps {
  data: Project[];
}

type SortKey = "friendlyName" | "businessOwner" | "technicalOwner" | "riskTier";
type SortDirection = "asc" | "desc";

export function AccountabilityMatrix({ data }: AccountabilityMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("friendlyName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter(
    (project) =>
      project.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.businessOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technicalOwner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const riskOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

    let comparison = 0;
    if (sortKey === "riskTier") {
      comparison = riskOrder[a.riskTier] - riskOrder[b.riskTier];
    } else {
      comparison = a[sortKey].localeCompare(b[sortKey]);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey)
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const getRiskBadgeVariant = (tier: Project["riskTier"]) => {
    switch (tier) {
      case "Critical":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "High":
        return "bg-warning/20 text-warning border-warning/30";
      case "Medium":
        return "bg-primary/20 text-primary border-primary/30";
      case "Low":
        return "bg-accent/20 text-accent border-accent/30";
    }
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "Active":
        return "bg-accent/10 text-accent border-accent/20";
      case "In Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Archived":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Project Accountability Matrix
          </h2>
          <p className="text-sm text-muted-foreground">
            {sortedData.length} of {data.length} initiatives shown
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search initiatives or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary/50 pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("friendlyName")}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Initiative (Friendly_Name)
                  <SortIcon columnKey="friendlyName" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("businessOwner")}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Funding Lead (Business_Owner)
                  <SortIcon columnKey="businessOwner" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("technicalOwner")}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Support Lead (Technical_Owner)
                  <SortIcon columnKey="technicalOwner" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("riskTier")}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Risk Tier
                  <SortIcon columnKey="riskTier" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((project) => (
              <tr
                key={project.id}
                className="group transition-colors hover:bg-secondary/20"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/initiative/${project.id}`}
                    className="group/link flex items-center gap-3"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        project.completeness >= 90
                          ? "bg-accent"
                          : project.completeness >= 70
                            ? "bg-primary"
                            : project.completeness >= 50
                              ? "bg-warning"
                              : "bg-destructive"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-card-foreground transition-colors group-hover/link:text-primary">
                          {project.friendlyName}
                        </p>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {project.businessUnit}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-card-foreground">
                      {project.businessOwner}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.businessOwnerEmail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-card-foreground">
                      {project.technicalOwner}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.technicalOwnerEmail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`${getRiskBadgeVariant(project.riskTier)} font-medium`}
                  >
                    {project.riskTier}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`${getStatusBadge(project.status)} font-medium`}
                  >
                    {project.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/initiative/${project.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Model Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                      <DropdownMenuItem>Export Record</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            No initiatives found
          </p>
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
