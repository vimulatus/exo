import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const experimentStatus = pgEnum("experiment_status", [
  "draft",
  "generating",
  "review",
  "live",
  "closed",
]);

export const testMethod = pgEnum("test_method", ["within", "between"]);

export const experiment = pgTable("experiment", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  componentUnderTest: text("component_under_test").notNull(),
  dataSchema: jsonb("data_schema").$type<unknown>().notNull(),
  status: experimentStatus("status").notNull().default("draft"),
  recordingEnabled: boolean("recording_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const designReference = pgTable(
  "design_reference",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id")
      .notNull()
      .references(() => experiment.id, { onDelete: "cascade" }),
    handle: text("handle").notNull(),
    figmaUrl: text("figma_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("design_reference_experiment_handle").on(t.experimentId, t.handle),
  ],
);

export const variant = pgTable("variant", {
  id: uuid("id").primaryKey().defaultRandom(),
  experimentId: uuid("experiment_id")
    .notNull()
    .references(() => experiment.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  brief: text("brief").notNull(),
  html: text("html"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const scenario = pgTable("scenario", {
  id: uuid("id").primaryKey().defaultRandom(),
  experimentId: uuid("experiment_id")
    .notNull()
    .references(() => experiment.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  successCriterion: text("success_criterion").notNull(),
  fixture: jsonb("fixture").$type<unknown>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const criterion = pgTable("criterion", {
  id: uuid("id").primaryKey().defaultRandom(),
  experimentId: uuid("experiment_id")
    .notNull()
    .references(() => experiment.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  experimentId: uuid("experiment_id")
    .notNull()
    .references(() => experiment.id, { onDelete: "cascade" }),
  method: testMethod("method").notNull().default("within"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const result = pgTable(
  "result",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => session.id, { onDelete: "cascade" }),
    scenarioId: uuid("scenario_id")
      .notNull()
      .references(() => scenario.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => variant.id, { onDelete: "cascade" }),
    scores: jsonb("scores").$type<Record<string, number>>().notNull(),
    timeMs: integer("time_ms").notNull(),
    comment: text("comment"),
    recordingRef: text("recording_ref"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("result_session_scenario_variant").on(
      t.sessionId,
      t.scenarioId,
      t.variantId,
    ),
  ],
);

export const experimentRelations = relations(experiment, ({ many }) => ({
  designReferences: many(designReference),
  variants: many(variant),
  scenarios: many(scenario),
  criteria: many(criterion),
  sessions: many(session),
}));

export const designReferenceRelations = relations(
  designReference,
  ({ one }) => ({
    experiment: one(experiment, {
      fields: [designReference.experimentId],
      references: [experiment.id],
    }),
  }),
);

export const variantRelations = relations(variant, ({ one, many }) => ({
  experiment: one(experiment, {
    fields: [variant.experimentId],
    references: [experiment.id],
  }),
  results: many(result),
}));

export const scenarioRelations = relations(scenario, ({ one, many }) => ({
  experiment: one(experiment, {
    fields: [scenario.experimentId],
    references: [experiment.id],
  }),
  results: many(result),
}));

export const criterionRelations = relations(criterion, ({ one }) => ({
  experiment: one(experiment, {
    fields: [criterion.experimentId],
    references: [experiment.id],
  }),
}));

export const sessionRelations = relations(session, ({ one, many }) => ({
  experiment: one(experiment, {
    fields: [session.experimentId],
    references: [experiment.id],
  }),
  results: many(result),
}));

export const resultRelations = relations(result, ({ one }) => ({
  session: one(session, {
    fields: [result.sessionId],
    references: [session.id],
  }),
  scenario: one(scenario, {
    fields: [result.scenarioId],
    references: [scenario.id],
  }),
  variant: one(variant, {
    fields: [result.variantId],
    references: [variant.id],
  }),
}));
