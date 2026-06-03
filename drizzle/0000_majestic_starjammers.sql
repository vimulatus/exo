CREATE TYPE "public"."experiment_status" AS ENUM('draft', 'generating', 'review', 'live', 'closed');--> statement-breakpoint
CREATE TYPE "public"."test_method" AS ENUM('within', 'between');--> statement-breakpoint
CREATE TABLE "criterion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_reference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"handle" text NOT NULL,
	"figma_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "design_reference_experiment_handle" UNIQUE("experiment_id","handle")
);
--> statement-breakpoint
CREATE TABLE "experiment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"component_under_test" text NOT NULL,
	"data_schema" jsonb NOT NULL,
	"status" "experiment_status" DEFAULT 'draft' NOT NULL,
	"recording_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "result" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"scenario_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"scores" jsonb NOT NULL,
	"time_ms" integer NOT NULL,
	"comment" text,
	"recording_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "result_session_scenario_variant" UNIQUE("session_id","scenario_id","variant_id")
);
--> statement-breakpoint
CREATE TABLE "scenario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"title" text NOT NULL,
	"success_criterion" text NOT NULL,
	"fixture" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"method" "test_method" DEFAULT 'within' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "variant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"title" text NOT NULL,
	"brief" text NOT NULL,
	"html" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "criterion" ADD CONSTRAINT "criterion_experiment_id_experiment_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_reference" ADD CONSTRAINT "design_reference_experiment_id_experiment_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_scenario_id_scenario_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_variant_id_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario" ADD CONSTRAINT "scenario_experiment_id_experiment_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_experiment_id_experiment_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant" ADD CONSTRAINT "variant_experiment_id_experiment_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiment"("id") ON DELETE cascade ON UPDATE no action;