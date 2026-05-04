export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
}

export interface HealthData {
  status: "ok";
  timestamp: string;
}

export interface DataItem {
  id: number;
  label: string;
  value: string;
}

export interface SampleData {
  title: string;
  description: string;
  items: DataItem[];
}