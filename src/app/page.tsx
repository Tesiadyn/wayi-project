"use client";

import React, { useState, useEffect } from "react";

interface TaskProps {
  id: number;
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

  const toggleCompeletedTask = () => {
    setShowCompeletedTask(!showCompeletedTask);

    if (!showCompeletedTask) {
      const incompeletedTasks = allTasks.filter((task) => !task.is_completed);
      setFilteredTasks(incompeletedTasks);
    } else {
      setFilteredTasks(allTasks);
    }
  };

  return (
    <>
      <button onClick={toggleCompeletedTask}>
        {showCompeletedTask ? "Show compeleted" : "Hide compeleted"}
      </button>
      {filteredTasks.map((task) => (
        <div key={task.id}>
          <h1>{task.id}</h1>
          <h2>{task.name}</h2>
          <p>{task.description}</p>
          <p>Compeleted : {task.is_completed.toString()}</p>
          <p>{task.created_at}</p>
          <p>{task.updated_at}</p>
        </div>
      ))}
    </>
  );
}
