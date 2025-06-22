import { Module } from "@/types/learning";
import { getModuleProgress } from "./progress-data";

// Calculate overall progress
export const calculateOverallProgress = (modules: Module[]): number => {
  const totalModules = modules.length;
  const totalProgress = modules.reduce((sum, module) => {
    return sum + getModuleProgress(module.id);
  }, 0);
  return Math.round(totalProgress / totalModules);
};

// Calculate completed modules count
export const getCompletedModulesCount = (modules: Module[]): number => {
  return modules.filter((module) => getModuleProgress(module.id) === 100).length;
};

// Calculate in-progress modules count
export const getInProgressModulesCount = (modules: Module[]): number => {
  return modules.filter((module) => {
    const progress = getModuleProgress(module.id);
    return progress > 0 && progress < 100;
  }).length;
};
