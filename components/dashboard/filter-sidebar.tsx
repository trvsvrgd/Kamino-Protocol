"use client";

import { useState } from "react";
import {
  ChevronDown,
  Filter,
  Building2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSidebarProps {
  businessUnits: string[];
  riskTiers: string[];
  selectedBusinessUnits: string[];
  selectedRiskTiers: string[];
  onBusinessUnitChange: (units: string[]) => void;
  onRiskTierChange: (tiers: string[]) => void;
  onReset: () => void;
}

export function FilterSidebar({
  businessUnits,
  riskTiers,
  selectedBusinessUnits,
  selectedRiskTiers,
  onBusinessUnitChange,
  onRiskTierChange,
  onReset,
}: FilterSidebarProps) {
  const [businessUnitOpen, setBusinessUnitOpen] = useState(true);
  const [riskTierOpen, setRiskTierOpen] = useState(true);

  const handleBusinessUnitToggle = (unit: string) => {
    if (selectedBusinessUnits.includes(unit)) {
      onBusinessUnitChange(selectedBusinessUnits.filter((u) => u !== unit));
    } else {
      onBusinessUnitChange([...selectedBusinessUnits, unit]);
    }
  };

  const handleRiskTierToggle = (tier: string) => {
    if (selectedRiskTiers.includes(tier)) {
      onRiskTierChange(selectedRiskTiers.filter((t) => t !== tier));
    } else {
      onRiskTierChange([...selectedRiskTiers, tier]);
    }
  };

  const activeFiltersCount =
    selectedBusinessUnits.length + selectedRiskTiers.length;

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sidebar-foreground">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <Collapsible open={businessUnitOpen} onOpenChange={setBusinessUnitOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Business Unit</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${businessUnitOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1 pl-6">
            {businessUnits.map((unit) => (
              <label
                key={unit}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Checkbox
                  checked={selectedBusinessUnits.includes(unit)}
                  onCheckedChange={() => handleBusinessUnitToggle(unit)}
                  className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span>{unit}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={riskTierOpen} onOpenChange={setRiskTierOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span>Risk Tier</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${riskTierOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1 pl-6">
            {riskTiers.map((tier) => (
              <label
                key={tier}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Checkbox
                  checked={selectedRiskTiers.includes(tier)}
                  onCheckedChange={() => handleRiskTierToggle(tier)}
                  className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span
                  className={`flex items-center gap-2 ${
                    tier === "Critical"
                      ? "text-destructive"
                      : tier === "High"
                        ? "text-warning"
                        : tier === "Medium"
                          ? "text-primary"
                          : "text-muted-foreground"
                  }`}
                >
                  {tier}
                </span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-secondary/50 p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Last Updated
        </p>
        <p className="mt-1 text-sm text-foreground">Jan 23, 2026 09:45 AM</p>
      </div>
    </aside>
  );
}
