'use client'

import React, {useState} from 'react';

interface TaskProps {
    id?: number;
    name: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  }
interface EditTaskFormProps{
    task: TaskProps;
    onSave: (updatedTask: TaskProps) => void;
    onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onSave, onCancel }) => {
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [isCompleted, setIsCompleted] = useState(task.is_completed);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ ...task, name, description, is_completed: isCompleted });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Completed
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };
  export default EditTaskForm;