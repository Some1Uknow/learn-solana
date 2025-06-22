export interface Topic {
  id: string;
  title: string;
  description: string;
  type: "theory" | "exercise" | "project";
}

export interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  topics?: Topic[];
}

export interface ContentsData {
  header: {
    title: string;
    description: string;
  };
  modules: Module[];
}

export interface ProgressData {
  moduleProgress: Record<string, number>;
  topicCompletion: Record<string, Record<string, boolean>>;
}
