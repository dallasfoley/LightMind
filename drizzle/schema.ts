import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  journalStreak: integer("journalStreak").default(0),
  enableNotifications: boolean("enableNotifications").default(false),
  phoneNumber: text("phoneNumber"),
});

export const CheckInTable = pgTable("checkIns", {
  id: uuid("id").primaryKey().defaultRandom(),
  mood: integer("mood").notNull(),
  energy: integer("energy").notNull(),
  sleepHours: integer("sleepHours").notNull(),
  sleepQuality: integer("sleepQuality").notNull(),
  stress: integer("stress").notNull(),
  notes: text("notes"),
  date: date("date").notNull(),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
});

export const RemindersTable = pgTable("reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  datetime: timestamp("datetime").notNull(),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
  completed: boolean("completed").default(false),
  notificationTime: integer("notificationTime"),
});

export const JournalTable = pgTable("journals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  date: date("date").notNull(),
  content: text("content").notNull(),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
});

export const userRelations = relations(UserTable, ({ many }) => ({
  checkIns: many(CheckInTable),
  reminders: many(RemindersTable),
  journals: many(JournalTable),
}));

export const checkInRelations = relations(CheckInTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [CheckInTable.userId],
    references: [UserTable.id],
  }),
}));

export const reminderRelations = relations(RemindersTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [RemindersTable.userId],
    references: [UserTable.id],
  }),
}));

export const journalsRelations = relations(JournalTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [JournalTable.userId],
    references: [UserTable.id],
  }),
}));
