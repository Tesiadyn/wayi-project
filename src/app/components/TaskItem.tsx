"use client";

import { useState } from "react";
import { TaskProps } from "../interface";
import EditTaskForm from "./EditTaskForm";

interface TaskItemProps extends TaskProps {
  onCheckboxChange: (task: TaskProps) => void;
  onEdit: (id: number, updatedTask: TaskProps) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({
  id,
  name,
  description,
  is_completed,
  created_at,
  updated_at,
  onCheckboxChange,
  onEdit,
  onDelete,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedTask: TaskProps) => {
    onEdit(id!, updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <EditTaskForm
        task={{ id, name, description, is_completed, created_at, updated_at }}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <li className="w-50 bg-gray-200 shadow-md rounded-lg p-4 mb-4 mx-4 list-none xl:w-2/5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-black">{name}</h2>
        <div>
          <label className="text-black" htmlFor={`comp_status_${id}`}>
            Completed
          </label>
          <input
            id={`comp_status_${id}`}
            type="checkbox"
            checked={is_completed}
            onChange={() =>
              onCheckboxChange({
                id,
                name,
                description,
                is_completed,
                created_at,
                updated_at,
              })
            }
            className="h-5 w-5"
          />
        </div>
      </div>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="flex flex-wrap justify-between items-center">
        <div className="md:w-full md:w-full text-center xl:w-auto">
          <p className="text-sm text-red-500">Created at: {created_at}</p>
          <p className="text-sm text-gray-500">Updated at: {updated_at}</p>
        </div>
        <div className="xl:inline-block md:flex w-full justify-center">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id!)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
