import { Module } from "@/types/learning";

interface ModulesData {
  modules: Module[];
}

export async function getModulesData(): Promise<Module[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/contents-data.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch module data');
  }
  const data: ModulesData = await response.json();
  return data.modules;
}
