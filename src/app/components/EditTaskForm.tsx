"use client";

import React, { useState } from "react";
import { EditTaskFormProps } from "../interface";

const EditTaskForm = ({ task, onSave, onCancel }: EditTaskFormProps) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...task, name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Task name(10 chars max)"
        className="text-white bg-black rounded-md mx-2 px-6 text-center"
        maxLength={10}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-white bg-black rounded-md mx-2 px-6 text-center"
        placeholder="description(optional)(30 chars max)"
        maxLength={30}
      />
      <button
        className="mx-4 bg-blue-800 text-white rounded-md px-6"
        type="submit"
      >
        Save
      </button>
      <button
        className="mx-4 bg-pink-600  text-white rounded-md px-6"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};
export default EditTaskForm;
