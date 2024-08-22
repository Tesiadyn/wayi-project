"use client";
import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import EditTaskForm from "./EditTaskForm";
import NewTaskForm from "./NewTaskForm";
import { TaskProps } from "../interface";

const TaskList = () => {
  const [showCompeletedTask, setShowCompeletedTask] = useState(true);
  const [allTasks, setAllTasks] = useState<Array<TaskProps>>([]);
  const [filteredTasks, setFilteredTasks] = useState<Array<TaskProps>>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // get all tasks data
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

  // set state when showCompeletedTask change
  useEffect(() => {
    if (!showCompeletedTask) {
      setFilteredTasks(allTasks.filter((task) => !task.is_completed));
    } else {
      setFilteredTasks(allTasks);
    }
  }, [showCompeletedTask, allTasks, updateTrigger]);

  // toggle showCompeletedTask
  const toggleCompeletedTask = () => {
    setShowCompeletedTask((prevShowCompeletedTask) => !prevShowCompeletedTask);
  };

  // handle the change when is_completed change
  const handleCheckboxChange = async (task: TaskProps) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };
    try {
      const res = await fetch(
        `https://wayi.league-funny.com/api/task/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_completed: updatedTask.is_completed }),
        }
      );
      setAllTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      setFilteredTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      setUpdateTrigger((prev) => prev + 1);
      if (!res.ok) {
        throw new Error("Failed to update task completed status");
      }
    } catch (err) {
      console.error("Error when update task completed status: ", err);
    }
  };

  // handle the delete task
  const handleTaskDelete = async (id: number) => {
    try {
      const res = await fetch(`https://wayi.league-funny.com/api/task/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error("Error when delete task: ", err);
    }
  };

  // handle the save of editing task
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
        throw new Error("Failed to update edited task");
      }

      const updatedTaskData = await res.json();

      setAllTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskData.id ? updatedTaskData : task
        )
      );
      setFilteredTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskData.id ? updatedTaskData : task
        )
      );
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error when update edited task: ", err);
    }
  };

  return (
    <>
      <NewTaskForm />
      <button
        className="flex mx-auto bg-green-700 text-white py-2 px-4 my-4 rounded-md hover:bg-blue-600"
        onClick={toggleCompeletedTask}
      >
        {showCompeletedTask ? "Hide compeleted task" : "Show compeleted task"}
      </button>
      <div className="flex justify-center flex-wrap">
        {filteredTasks.map((task) =>
          editingTaskId === task.id ? (
            <EditTaskForm
              key={task.id}
              task={task}
              onCancel={() => setEditingTaskId(null)}
              onSave={handleSaveTask}
            />
          ) : (
            <TaskItem
              key={task.id}
              {...task}
              onCheckboxChange={handleCheckboxChange}
              onEdit={(id, updatedTask) => handleSaveTask(updatedTask)}
              onDelete={handleTaskDelete}
            />
          )
        )}
      </div>
    </>
  );
};

export default TaskList;
