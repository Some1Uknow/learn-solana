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
  icon: string;
  topics: Topic[];
}
