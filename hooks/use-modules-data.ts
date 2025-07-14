import useSWR from 'swr';

interface Topic {
  id: string;
  title: string;
  description: string;
  type: "theory" | "exercise" | "project";
}

interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  topics: Topic[];
}

interface ModulesData {
  modules: Module[];
}

const fetcher = async (url: string): Promise<ModulesData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch module data');
  }
  return response.json();
};

export const useModulesData = () => {
  const { data, error, isLoading, mutate } = useSWR<ModulesData>(
    '/data/contents-data.json',
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate when window regains focus
      revalidateOnReconnect: true, // Revalidate when network reconnects
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    modules: data?.modules || [],
    isLoading,
    error,
    mutate, // For manual revalidation if needed
  };
};

export const useModuleById = (moduleId: string) => {
  const { modules, isLoading, error, mutate } = useModulesData();
  
  const module = modules.find((m: Module) => m.id === moduleId) || null;
  
  return {
    module,
    allModules: modules,
    isLoading,
    error,
    mutate,
  };
};
