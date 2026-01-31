-- CreateTable
CREATE TABLE "pattern_records" (
    "id" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_key" TEXT NOT NULL,
    "window_start" DATE NOT NULL,
    "window_end" DATE NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "record" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pattern_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pattern_records_entity_type_window_end_idx" ON "pattern_records"("entity_type", "window_end");

-- CreateIndex
CREATE INDEX "pattern_records_scenario_idx" ON "pattern_records"("scenario");

-- CreateIndex
CREATE INDEX "pattern_records_entity_key_idx" ON "pattern_records"("entity_key");

-- CreateIndex
CREATE INDEX "pattern_records_window_start_window_end_idx" ON "pattern_records"("window_start", "window_end");
