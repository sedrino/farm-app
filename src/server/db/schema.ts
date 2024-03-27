import {
  integer,
  text,
  real,
  blob,
  sqliteTable,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Players Table
export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: integer("age"),
  gender: text("gender"),
  experienceLevel: text("experience_level"),
  photo: blob("photo"),
  waiverSigned: integer("waiver_signed", { mode: "boolean" }).default(0), // 0 for false, 1 for true
});

// Teams Table
const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  captainId: integer("captain_id").notNull(),
});

// Team Members (Rosters) Table
const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerId: integer("player_id").notNull(),
  teamId: integer("team_id").notNull(),
});

// Games Table
const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: integer("date", { mode: "timestamp" }).notNull(), // Using text to store ISO8601 dates
  location: text("location").notNull(),
  teamAId: integer("team_a_id").notNull(),
  teamBId: integer("team_b_id").notNull(),
  refereeId: integer("referee_id"),
});

// Scores Table
const scores = sqliteTable("scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameId: integer("game_id").notNull(),
  teamId: integer("team_id").notNull(),
  score: integer("score").notNull(),
  spiritScore: real("spirit_score"),
});

// Player Stats Table
const playerStats = sqliteTable("player_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerId: integer("player_id").notNull(),
  gameId: integer("game_id").notNull(),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  blocks: integer("blocks").default(0),
});

// Communication Table (for league-wide messaging, team communication, alerts, and reminders)
const communications = sqliteTable("communications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  messageType: text("message_type").notNull(), // "league-wide", "team", "alert"
  message: text("message").notNull(),
  targetId: integer("target_id"), // Can be null for league-wide messages
  sentAt: integer("sent_at", { mode: "timestamp" }).notNull(),
});

// Settings Table (for league rules, scoring rules, playoff structure, notification preferences)
const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingType: text("setting_type").notNull(), // "league_rules", "scoring_rules", "playoff_structure", "notifications"
  value: text("value", { mode: "json" }).$type<{}>(), // Storing JSON data
});
