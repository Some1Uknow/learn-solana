"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { Module } from "@/types/learning";
import ModuleCard from "./module-card";

interface ModulesSectionProps {
  modules: Module[];
}

export default function ModulesSection({ modules }: ModulesSectionProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newOpenModules = new Set(openModules);
    if (newOpenModules.has(moduleId)) {
      newOpenModules.delete(moduleId);
    } else {
      newOpenModules.add(moduleId);
    }
    setOpenModules(newOpenModules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Module Progress</h2>
      </div>

      {modules.map((module, index) => {
        const isOpen = openModules.has(module.id);
        return (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            isOpen={isOpen}
            onToggle={() => toggleModule(module.id)}
          />
        );
      })}
    </div>
  );
}
