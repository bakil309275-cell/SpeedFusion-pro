import { useState, useEffect } from "react";

export function useSpeedHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("speedHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const addResult = (result) => {
    const newHistory = [result, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("speedHistory", JSON.stringify(newHistory));
  };

  return { history, addResult };
}
