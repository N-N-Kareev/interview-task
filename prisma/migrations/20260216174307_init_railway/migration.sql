-- CreateTable
CREATE TABLE "Wagon" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wagon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEvent" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "wagonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wagon_serialNumber_key" ON "Wagon"("serialNumber");

-- CreateIndex
CREATE INDEX "TrackingEvent_wagonId_eventTime_idx" ON "TrackingEvent"("wagonId", "eventTime");

-- AddForeignKey
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_wagonId_fkey" FOREIGN KEY ("wagonId") REFERENCES "Wagon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
