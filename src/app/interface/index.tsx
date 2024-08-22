export interface TaskProps {
    id?: number;
    name: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  }
export interface EditTaskFormProps {
    task: TaskProps;
    onSave: (updatedTask: TaskProps) => void;
    onCancel: () => void;
  }
  
 export interface EditTaskItemProps extends TaskProps {
    task: TaskProps
    onCheckboxChange: (task: TaskProps) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onSave: (updatedTask: TaskProps) => void;
    onCancel: () => void; 
  }