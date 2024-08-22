"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { TaskProps } from "../interface/index";

const NewTaskForm = () => {
  const [newTask, setNewTask] = useState<TaskProps>({
    name: "",
    description: "",
    is_completed: false,
    created_at: "",
    updated_at: "",
  });

  // tracking value when user typing
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // handle form submit the form
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const timeStamp = new Date().toISOString();
    const updatedTask = {
      ...newTask,
      created_at: timeStamp,
      updated_at: timeStamp,
    };
    setNewTask(updatedTask);
    try {
      const res = await fetch("https://wayi.league-funny.com/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      if (res.ok) {
        console.log("new task added");
      } else {
        console.error("new task not added");
      }
    } catch (err) {
      console.error("Error when adding new task:", err);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col max-w-sm mx-auto mb-4"
    >
      <input
        type="text"
        name="name"
        value={newTask.name}
        onChange={handleFormChange}
        placeholder="Task name(10 characters max)"
        className="mb-3 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        maxLength={10}
      />
      <textarea
        name="description"
        value={newTask.description}
        onChange={handleFormChange}
        placeholder="description(30 characters max)"
        maxLength={30}
        className="mb-3 px-3 text-black py-2 border border-gray-300 rounded-md h-24 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        New Task
      </button>
    </form>
  );
};

export default NewTaskForm;
