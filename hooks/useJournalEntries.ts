import { useState, useEffect } from "react";

interface JournalEntry {
  date: string;
  content: string;
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem("journalEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  const saveEntry = (date: string, content: string) => {
    const newEntries = [...entries];
    const existingEntryIndex = newEntries.findIndex(
      (entry) => entry.date === date
    );

    if (existingEntryIndex !== -1) {
      newEntries[existingEntryIndex].content = content;
    } else {
      newEntries.push({ date, content });
    }

    setEntries(newEntries);
    localStorage.setItem("journalEntries", JSON.stringify(newEntries));
  };

  const getEntry = (date: string) => {
    return entries.find((entry) => entry.date === date);
  };

  return { entries, saveEntry, getEntry };
}
