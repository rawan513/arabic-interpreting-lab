"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Material = {
  id: number;
  title: string;
  kind: string;
  direction: string;
  topic: string;
  source: string;
  original: string;
  translation?: string;
  aiTranslation?: string;
  notes?: string;
};

export type Session = {
  id: number;
  title: string;
  direction: string;
  minutes: number;
  date: string;
  reflection?: string;
  goal?: string;
};

export type ErrorItem = {
  id: number;
  type: string;
  source: string;
  mine: string;
  better?: string;
  reason?: string;
  status: string;
};

export type VocabItem = {
  id: number;
  cn: string;
  ar: string;
  type: string;
  topic: string;
  mastery: string;
  example?: string;
};

export type Task = {
  id: number;
  title: string;
  minutes: number;
  done: boolean;
};

export type Dictation = {
  id: number;
  topic: string;
  source: string;
  link: string;
  original: string;
  transcript: string;
  translation: string;
  notes?: string;
};

const initialMaterials: Material[] = [];
const initialSessions: Session[] = [];
const initialErrors: ErrorItem[] = [];
const initialVocab: VocabItem[] = [];
const initialTasks: Task[] = [
  { id: 1, title: "完成一段新闻听抄", minutes: 25, done: false },
  { id: 2, title: "进行 15 分钟中译阿练习", minutes: 15, done: false },
  { id: 3, title: "整理 10 个阿语表达", minutes: 20, done: false },
];
const initialDictations: Dictation[] = [];

type Ctx = {
  materials: Material[];
  sessions: Session[];
  errors: ErrorItem[];
  vocab: VocabItem[];
  tasks: Task[];
  dictations: Dictation[];
  activityDates: string[];
  saveMaterial: (x: Omit<Material, "id">, id?: number) => void;
  saveSession: (x: Omit<Session, "id">, id?: number) => void;
  saveError: (x: Omit<ErrorItem, "id">, id?: number) => void;
  saveVocab: (x: Omit<VocabItem, "id">, id?: number) => void;
  saveTask: (x: Omit<Task, "id">, id?: number) => void;
  saveDictation: (x: Omit<Dictation, "id">, id?: number) => void;
  toggleTask: (id: number) => void;
  markActivity: (date?: string) => void;
  remove: (type: string, id: number) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [errors, setErrors] = useState<ErrorItem[]>(initialErrors);
  const [vocab, setVocab] = useState<VocabItem[]>(initialVocab);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dictations, setDictations] = useState<Dictation[]>(initialDictations);
  const [activityDates, setActivityDates] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ail-data");
      if (!raw) return;
      const data = JSON.parse(raw);
      setMaterials(data.materials || initialMaterials);
      setSessions(data.sessions || initialSessions);
      setErrors(data.errors || initialErrors);
      setVocab(data.vocab || initialVocab);
      setTasks(data.tasks || initialTasks);
      setDictations(data.dictations || initialDictations);
      setActivityDates(data.activityDates || []);
    } catch {
      // Ignore malformed local data and keep the defaults.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ail-data",
        JSON.stringify({ materials, sessions, errors, vocab, tasks, dictations, activityDates }),
      );
    } catch {
      // Storage may be unavailable in private browsing or restricted environments.
    }
  }, [materials, sessions, errors, vocab, tasks, dictations, activityDates]);

  const save = <T extends { id: number }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    value: Omit<T, "id">,
    id?: number,
  ) => {
    setter((old) =>
      id === undefined
        ? [{ ...value, id: Date.now() } as T, ...old]
        : old.map((item) => (item.id === id ? ({ ...value, id } as T) : item)),
    );
  };

  const today = () => new Date().toISOString().slice(0, 10);
  const markActivity = (date?: string) => {
    const day = date || today();
    setActivityDates((old) => Array.from(new Set([...old, day])).sort());
  };

  const saveMaterial = (x: Omit<Material, "id">, id?: number) => save(setMaterials, x, id);
  const saveSession = (x: Omit<Session, "id">, id?: number) => {
    save(setSessions, x, id);
    markActivity();
  };
  const saveError = (x: Omit<ErrorItem, "id">, id?: number) => save(setErrors, x, id);
  const saveVocab = (x: Omit<VocabItem, "id">, id?: number) => save(setVocab, x, id);
  const saveTask = (x: Omit<Task, "id">, id?: number) => save(setTasks, x, id);
  const saveDictation = (x: Omit<Dictation, "id">, id?: number) => {
    save(setDictations, x, id);
    markActivity();
  };
  const toggleTask = (id: number) => {
    setTasks((old) => old.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
    markActivity();
  };

  const remove = (type: string, id: number) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any[]>>> = {
      materials: setMaterials,
      sessions: setSessions,
      errors: setErrors,
      vocab: setVocab,
      tasks: setTasks,
      dictations: setDictations,
    };
    setters[type]?.((old) => old.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        materials,
        sessions,
        errors,
        vocab,
        tasks,
        dictations,
        activityDates,
        saveMaterial,
        saveSession,
        saveError,
        saveVocab,
        saveTask,
        saveDictation,
        toggleTask,
        markActivity,
        remove,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
