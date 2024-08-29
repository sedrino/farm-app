import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey(),
  email: text("email").notNull().default(""),
  first_name: text("first_name").notNull().default(""),
  last_name: text("last_name").notNull().default(""),
});

export const user_roles = sqliteTable("user_roles", {
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(),
});

export const leagues = sqliteTable("leagues", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => leagues.id),
  name: text("name").notNull(),
  captainId: integer("captain_id"),
});

export const players = sqliteTable("players", {
  id: integer("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
});

export const games = sqliteTable("games", {
  id: integer("id").primaryKey(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => leagues.id),
  homeTeamId: integer("home_team_id")
    .notNull()
    .references(() => teams.id),
  awayTeamId: integer("away_team_id")
    .notNull()
    .references(() => teams.id),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  location: text("location"),
});

export const referees = sqliteTable("referees", {
  id: integer("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
});

export const playerStats = sqliteTable("player_stats", {
  id: integer("id").primaryKey(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  blocks: integer("blocks").notNull().default(0),
  turnovers: integer("turnovers").notNull().default(0),
});

export const teamStats = sqliteTable("team_stats", {
  id: integer("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id),
  score: integer("score").notNull(),
  spiritScore: real("spirit_score"),
});

export type LeagueInsert = typeof leagues.$inferInsert;
export type LeagueUpdate = Partial<typeof leagues.$inferSelect>;
export type League = typeof leagues.$inferSelect;

export type TeamInsert = typeof teams.$inferInsert;
export type TeamUpdate = Partial<typeof teams.$inferSelect>;
export type Team = typeof teams.$inferSelect;

export type PlayerInsert = typeof players.$inferInsert;
export type PlayerUpdate = Partial<typeof players.$inferSelect>;
export type Player = typeof players.$inferSelect;

export type GameInsert = typeof games.$inferInsert;
export type GameUpdate = Partial<typeof games.$inferSelect>;
export type Game = typeof games.$inferSelect;

export type RefereeInsert = typeof referees.$inferInsert;
export type RefereeUpdate = Partial<typeof referees.$inferSelect>;
export type Referee = typeof referees.$inferSelect;

export type PlayerStatInsert = typeof playerStats.$inferInsert;
export type PlayerStatUpdate = Partial<typeof playerStats.$inferSelect>;
export type PlayerStat = typeof playerStats.$inferSelect;

export type TeamStatInsert = typeof teamStats.$inferInsert;
export type TeamStatUpdate = Partial<typeof teamStats.$inferSelect>;
export type TeamStat = typeof teamStats.$inferSelect;
