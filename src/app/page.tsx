"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import EditTaskForm from "./EditTaskForm";
interface TaskProps {
  id?: number;
  name: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [allTasks, setAllTasks] = useState<Array<TaskProps>>([]);
  const [filteredTasks, setFilteredTasks] = useState<Array<TaskProps>>([]);
  const [showCompeletedTask, setShowCompeletedTask] = useState(true);
  const [newTask, setNewTask] = useState<TaskProps>({
    name: "",
    description: "",
    is_completed: false,
    created_at: "",
    updated_at: "",
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTaskList = async () => {
      const taskListData = await fetch(
        "https://wayi.league-funny.com/api/task"
      );
      const taskList = await taskListData.json();
      setAllTasks(taskList.data);
      setFilteredTasks(taskList.data);
    };
    fetchTaskList();
  }, []);

  useEffect(() => {
    if (!showCompeletedTask) {
      setFilteredTasks(allTasks.filter((task) => !task.is_completed));
    } else {
      setFilteredTasks(allTasks);
    }
  }, [showCompeletedTask, allTasks]);

  const toggleCompeletedTask = () => {
    setShowCompeletedTask((prevShowCompeletedTask) => !prevShowCompeletedTask);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };
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
        console.log("updated");
      } else {
        console.error("not updated");
      }
    } catch (err) {
      console.error("Error when adding new task:", err);
    }
  };

  const handleSaveTask = async (updatedTask: TaskProps) => {
    try {
      const res = await fetch(
        `https://wayi.league-funny.com/api/task/${updatedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTaskData = await res.json();

      setAllTasks(
        allTasks.map((task) =>
          task.id === updatedTaskData.id ? updatedTaskData : task
        )
      );

      setFilteredTasks(
        filteredTasks.map((task) =>
          task.id === updatedTaskData.id ? updatedTaskData : task
        )
      );

      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskDelete = async (id: number) => {
    const res = await fetch(`https://wayi.league-funny.com/api/task/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to update task");
    }
  };

  const handleCheckboxChange = async (task: TaskProps) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };
    try {
      await fetch(`https://wayi.league-funny.com/api/task/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: updatedTask.is_completed }),
      });
      setAllTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      setFilteredTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  return (
    <>
      <button onClick={toggleCompeletedTask}>
        {showCompeletedTask ? "Hide compeleted" : "Show compeleted"}
      </button>
      <div>
        <h2>new task</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="task_name">task name</label>
          <input
            id="task_name"
            name="name"
            value={newTask.name}
            placeholder="task name"
            onChange={handleFormChange}
            maxLength={10}
            type="input"
            required
          ></input>
          <label htmlFor="task_desc">
            description
            <input
              id="task_desc"
              name="description"
              value={newTask.description}
              placeholder="description(optional)"
              onChange={handleFormChange}
              maxLength={30}
              type="input"
            ></input>
          </label>
          <button type="submit">add new task</button>
        </form>
      </div>
      {filteredTasks.map((task) => (
        <div key={task.id}>
          {editingTaskId === task.id ? (
            <EditTaskForm
              task={task}
              onSave={handleSaveTask}
              onCancel={() => setEditingTaskId(null)}
            />
          ) : (
            <>
              <h1>id:{task.id}</h1>
              <h2>name:{task.name}</h2>
              <p>desc:{task.description}</p>
              <p>compeleted:{task.is_completed.toString()}</p>
              <label htmlFor={`comp_status_${task.id}`}>Completed</label>
              <input
                id={`comp_status_${task.id}`}
                type="checkbox"
                checked={task.is_completed}
                onChange={() => handleCheckboxChange(task)}
              ></input>
              <p>created:{task.created_at}</p>
              <p>updated:{task.updated_at}</p>
              <button onClick={() => setEditingTaskId(task.id ?? null)}>
                Edit
              </button>
              <button onClick={() => handleTaskDelete(task.id!)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </>
  );
}
