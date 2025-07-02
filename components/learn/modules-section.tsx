"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { Module } from "@/types/learning";
import ModuleCard from "./module-card";
import ModuleDetailsModal from "./module-details-modal";

interface ModulesSectionProps {
  modules: Module[];
}

export default function ModulesSection({ modules }: ModulesSectionProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModuleDetails = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const closeModuleDetails = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Learning Modules</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              onViewDetails={() => openModuleDetails(module)}
            />
          ))}
        </div>
      </div>

      <ModuleDetailsModal
        module={selectedModule}
        isOpen={isModalOpen}
        onClose={closeModuleDetails}
      />
    </>
  );
}
