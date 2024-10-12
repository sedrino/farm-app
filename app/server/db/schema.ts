
import {sql, relations} from "drizzle-orm";
import {
integer,
real,
text,
blob,
primaryKey,
foreignKey,
index,
uniqueIndex,
sqliteTable,
AnySQLiteColumn
} from "drizzle-orm/sqlite-core";
import {ulid} from "@std/ulid";
import {unixNow} from "@/lib/utils/time";

export const tableUser = sqliteTable("user", {
  userId: text("user_id")
    .primaryKey()
    .$default(() => `u-${ulid()}`),
  username: text("username").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  role: text("role").notNull(),
  lastLogin: integer("last_login", { mode: "number" }),
  isTrainer: integer("is_trainer", { mode: "boolean" }).default(false),
  isStaff: integer("is_staff", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableHorse = sqliteTable("horse", {
  horseId: text("horse_id")
    .primaryKey()
    .$default(() => `h-${ulid()}`),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  dateOfBirth: integer("date_of_birth", { mode: "number" }).notNull(),
  gender: text("gender").notNull(),
  color: text("color").notNull(),
  markings: text("markings"),
  height: integer("height"),
  weight: integer("weight"),
  microchipNumber: text("microchip_number"),
  ownerId: text("owner_id").references((): AnySQLiteColumn => tableUser.userId),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  specialNeeds: text("special_needs"),
  medicalHistory: text("medical_history"),
  feedingPreferences: text("feeding_preferences"),
  exercisePreferences: text("exercise_preferences"),
  profilePicture: text("profile_picture"),
  knownConditions: text("known_conditions"),
  allergies: text("allergies"),
  currentMedication: text("current_medication"),
  documents: text("documents", { mode: "json" }),
  photos: text("photos", { mode: "json" }),
  arrivalDate: integer("arrival_date", { mode: "number" }).notNull(),
  lastViewed: integer("last_viewed", { mode: "number" }),
  status: text("status"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBoarder = sqliteTable("boarder", {
  boarderId: text("boarder_id")
    .primaryKey()
    .$default(() => `b-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  emergencyContact: text("emergency_contact", { mode: "json" }),
  contractStatus: text("contract_status").notNull(),
  billingInfo: text("billing_info", { mode: "json" }),
  preferences: text("preferences", { mode: "json" }),
  profilePicture: text("profile_picture"),
  documents: text("documents", { mode: "json" }),
  name: text("name"),
  contactDetails: text("contact_details", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStall = sqliteTable("stall", {
  stallId: text("stall_id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  number: text("number").notNull(),
  size: text("size").notNull(),
  location: text("location").notNull(),
  features: text("features").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  notes: text("notes"),
  lastMaintenanceDate: integer("last_maintenance_date", { mode: "number" }),
  xCoordinate: integer("x_coordinate"),
  yCoordinate: integer("y_coordinate"),
  currentHorseId: text("current_horse_id").references(
    () => tableHorse.horseId,
  ),
  lastCleaned: integer("last_cleaned", { mode: "number" }),
  nextScheduledMaintenance: integer("next_scheduled_maintenance", {
    mode: "number",
  }),
  customizations: text("customizations"),
  barnId: text("barn_id").references(() => tableBarn.barnId),
  status: text("status").notNull(),
  barnSection: text("barn_section"),
  currentAvailability: text("current_availability").notNull(),
  lastModifiedBy: text("last_modified_by").references(
    () => tableUser.userId,
  ),
  lastModifiedAt: integer("last_modified_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableHealthRecord = sqliteTable("health_record", {
  healthRecordId: text("health_record_id")
    .primaryKey()
    .$default(() => `hr-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  eventDate: integer("event_date", { mode: "number" }).notNull(),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  veterinarian: text("veterinarian").notNull(),
  medications: text("medications"),
  followUpRequired: integer("follow_up_required", { mode: "boolean" }).default(false),
  followUpDate: integer("follow_up_date", { mode: "number" }),
  documentUrl: text("document_url"),
  vaccinationDueDate: integer("vaccination_due_date", { mode: "number" }),
  isOngoing: integer("is_ongoing", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExerciseLog = sqliteTable("exercise_log", {
  exerciseLogId: text("exercise_log_id")
    .primaryKey()
    .$default(() => `el-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  date: integer("date", { mode: "number" }).notNull(),
  startTime: integer("start_time", { mode: "number" }).notNull(),
  endTime: integer("end_time", { mode: "number" }).notNull(),
  duration: integer("duration").notNull(),
  type: text("type").notNull(),
  intensity: text("intensity").notNull(),
  trainer: text("trainer").notNull(),
  notes: text("notes"),
  performanceNotes: text("performance_notes"),
  goals: text("goals"),
  achievements: text("achievements"),
  horseBehavior: text("horse_behavior"),
  areasForImprovement: text("areas_for_improvement"),
  mediaUrls: text("media_urls", { mode: "json" }),
  summary: text("summary"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedingSchedule = sqliteTable("feeding_schedule", {
  feedingScheduleId: text("feeding_schedule_id")
    .primaryKey()
    .$default(() => `fs-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  feedType: text("feed_type").notNull(),
  quantity: integer("quantity").notNull(),
  feedingTime: integer("feeding_time", { mode: "number" }).notNull(),
  specialInstructions: text("special_instructions"),
  dayOfWeek: text("day_of_week").notNull(),
  isRecurring: integer("is_recurring", { mode: "boolean" }).notNull().default(false),
  recurrencePattern: text("recurrence_pattern"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableMaintenanceTask = sqliteTable("maintenance_task", {
  maintenanceTaskId: text("maintenance_task_id")
    .primaryKey()
    .$default(() => `mt-${ulid()}`),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  taskName: text("task_name").notNull(),
  scheduledDate: integer("scheduled_date", { mode: "number" }).notNull(),
  estimatedDuration: integer("estimated_duration").notNull(),
  priority: text("priority").notNull(),
  assignedStaff: text("assigned_staff", { mode: "json" }).$type<
    Record<string, any>
  >(),
  recurrencePattern: text("recurrence_pattern"),
  specialInstructions: text("special_instructions"),
  status: text("status").notNull(),
  completionDate: integer("completion_date", { mode: "number" }),
  colorCode: text("color_code"),
  recurrenceType: text("recurrence_type"),
  cost: real("cost"),
  completionTime: integer("completion_time"),
  staffId: text("staff_id").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableMaintenanceRequest = sqliteTable("maintenance_request", {
  maintenanceRequestId: text("maintenance_request_id")
    .primaryKey()
    .$default(() => `mr-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  submissionDate: integer("submission_date", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  completionDate: integer("completion_date", { mode: "number" }),
  assignedStaffId: text("assigned_staff_id").references(
    () => tableUser.userId,
  ),
  attachments: text("attachments", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInvoice = sqliteTable("invoice", {
  invoiceId: text("invoice_id")
    .primaryKey()
    .$default(() => `i-${ulid()}`),
  boarderId: text("boarder_id").references((): AnySQLiteColumn => tableBoarder.boarderId),
  invoiceDate: integer("invoice_date", { mode: "number" }).notNull(),
  dueDate: integer("due_date", { mode: "number" }).notNull(),
  totalAmount: decimal("total_amount").notNull(),
  status: text("status").notNull(),
  items: text("items", { mode: "json" }).$type<Record<string, any>>(),
  notes: text("notes"),
  subtotal: decimal("subtotal").notNull(),
  taxAmount: decimal("tax_amount").notNull(),
  draft: integer("draft", { mode: "boolean" }).notNull().default(false),
  pdfUrl: text("pdf_url"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePayment = sqliteTable("payment", {
  paymentId: text("payment_id")
    .primaryKey()
    .$default(() => `p-${ulid()}`),
  boarderId: text("boarder_id").references((): AnySQLiteColumn => tableBoarder.boarderId),
  invoiceId: text("invoice_id").references((): AnySQLiteColumn => tableInvoice.invoiceId),
  amount: decimal("amount").notNull(),
  paymentDate: integer("payment_date", { mode: "number" }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExpense = sqliteTable("expense", {
  expenseId: text("expense_id")
    .primaryKey()
    .$default(() => `e-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  date: integer("date", { mode: "number" }).notNull(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  vendor: text("vendor").notNull(),
  description: text("description"),
  paymentMethod: text("payment_method"),
  receiptUrl: text("receipt_url"),
  tags: text("tags", { mode: "json" }),
  isReconciled: integer("is_reconciled", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableIncome = sqliteTable("income", {
  incomeId: text("income_id")
    .primaryKey()
    .$default(() => `i-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  date: integer("date", { mode: "number" }).notNull(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  description: text("description"),
  paymentMethod: text("payment_method"),
  receiptUrl: text("receipt_url"),
  tags: text("tags", { mode: "json" }),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurrenceFrequency: text("recurrence_frequency"),
  documentUrl: text("document_url"),
  totalAmount: decimal("total_amount").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInventoryItem = sqliteTable("inventory_item", {
  inventoryItemId: text("inventory_item_id")
    .primaryKey()
    .$default(() => `ii-${ulid()}`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  unitOfMeasurement: text("unit_of_measurement").notNull(),
  reorderPoint: integer("reorder_point").notNull(),
  supplier: text("supplier", { mode: "json" }),
  notes: text("notes"),
  lastUpdated: integer("last_updated", { mode: "number" }),
  valuePerUnit: decimal("value_per_unit"),
  lowStockThreshold: integer("low_stock_threshold"),
  location: text("location"),
  imageUrl: text("image_url"),
  description: text("description"),
  subcategory: text("subcategory"),
  costPerUnit: decimal("cost_per_unit").notNull(),
  preferredSupplier: text("preferred_supplier"),
  storageLocation: text("storage_location"),
  lastUsageDate: integer("last_usage_date", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInventoryTransaction = sqliteTable("inventory_transaction", {
  inventoryTransactionId: text("inventory_transaction_id")
    .primaryKey()
    .$default(() => `it-${ulid()}`),
  itemId: text("item_id").references(
    (): AnySQLiteColumn => tableInventoryItem.inventoryItemId,
  ),
  transactionType: text("transaction_type").notNull(),
  quantity: integer("quantity").notNull(),
  transactionDate: integer("transaction_date", { mode: "number" }).notNull(),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  notes: text("notes"),
  transactionReason: text("transaction_reason"),
  transactionValue: decimal("transaction_value").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePasture = sqliteTable("pasture", {
  pastureId: text("pasture_id")
    .primaryKey()
    .$default(() => `p-${ulid()}`),
  name: text("name").notNull(),
  size: text("size").notNull(),
  location: text("location").notNull(),
  fencingType: text("fencing_type").notNull(),
  waterSource: text("water_source").notNull(),
  shadeAvailability: text("shade_availability").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  notes: text("notes"),
  currentStatus: text("current_status"),
  lastRotationDate: integer("last_rotation_date", { mode: "number" }),
  maxUsageTime: integer("max_usage_time"),
  grassCondition: text("grass_condition"),
  status: text("status").notNull(),
  currentOccupancy: integer("current_occupancy").notNull(),
  nextRotationDate: integer("next_rotation_date", { mode: "number" }),
  maintenanceHistory: text("maintenance_history", { mode: "json" }),
  occupancy: integer("occupancy"),
  scheduledRotation: text("scheduled_rotation"),
  mapCoordinates: text("map_coordinates", { mode: "json" }),
  grassConditionIndicator: text("grass_condition_indicator"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePastureRotation = sqliteTable("pasture_rotation", {
  pastureRotationId: text("pasture_rotation_id")
    .primaryKey()
    .$default(() => `pr-${ulid()}`),
  pastureId: text("pasture_id").references(
    (): AnySQLiteColumn => tablePasture.pastureId,
  ),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  horses: text("horses", { mode: "json" }).$type<string[]>(),
  notes: text("notes"),
  plannedEndDate: integer("planned_end_date", { mode: "number" }),
  rotationDuration: integer("rotation_duration"),
  status: text("status"),
  currentOccupancy: integer("current_occupancy"),
  daysLeft: integer("days_left"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableVisitor = sqliteTable("visitor", {
  visitorId: text("visitor_id")
    .primaryKey()
    .$default(() => `v-${ulid()}`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  contactInfo: text("contact_info", { mode: "json" }),
  associatedBoarders: text("associated_boarders", { mode: "json" }),
  visitFrequency: text("visit_frequency"),
  specialInstructions: text("special_instructions"),
  status: text("status"),
  lastVisitDate: integer("last_visit_date", { mode: "number" }),
  accessPermissions: text("access_permissions", { mode: "json" }),
  documents: text("documents", { mode: "json" }),
  purpose: text("purpose"),
  visitDate: integer("visit_date", { mode: "number" }).notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  accessStatus: text("access_status"),
  frequency: text("frequency"),
  visitTime: integer("visit_time", { mode: "number" }),
  associatedHorseId: text("associated_horse_id").references(
    () => tableHorse.horseId,
  ),
  associatedBoarderId: text("associated_boarder_id").references(
    () => tableBoarder.boarderId,
  ),
  specialRequirements: text("special_requirements"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableVisit = sqliteTable("visit", {
  visitId: text("visit_id")
    .primaryKey()
    .$default(() => `v-${ulid()}`),
  visitorId: text("visitor_id").references((): AnySQLiteColumn => tableVisitor.visitorId),
  visitDate: integer("visit_date", { mode: "number" }).notNull(),
  purpose: text("purpose").notNull(),
  duration: text("duration").notNull(),
  associatedHorseId: text("associated_horse_id").references(
    () => tableHorse.horseId,
  ),
  notes: text("notes"),
  checkInTime: integer("check_in_time", { mode: "number" }),
  checkOutTime: integer("check_out_time", { mode: "number" }),
  checkInStatus: text("check_in_status"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableEvent = sqliteTable("event", {
  eventId: text("event_id")
    .primaryKey()
    .$default(() => `e-${ulid()}`),
  name: text("name").notNull(),
  eventType: text("event_type").notNull(),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  location: text("location").notNull(),
  description: text("description"),
  maxParticipants: integer("max_participants"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  capacity: integer("capacity"),
  revenue: real("revenue"),
  color: text("color"),
  eventCategory: text("event_category"),
  recurrencePattern: text("recurrence_pattern"),
  documents: text("documents", { mode: "json" }),
  facilityId: text("facility_id").references(
    (): AnySQLiteColumn => tableFacility.facilityId,
  ),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableEventParticipant = sqliteTable("event_participant", {
  eventParticipantId: text("event_participant_id")
    .primaryKey()
    .$default(() => `ep-${ulid()}`),
  eventId: text("event_id").references((): AnySQLiteColumn => tableEvent.eventId),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  registrationDate: integer("registration_date", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  participationStatus: text("participation_status"),
  contactInfo: text("contact_info", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFacility = sqliteTable("facility", {
  facilityId: text("facility_id")
    .primaryKey()
    .$default(() => `f-${ulid()}`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  category: text("category"),
  currentAvailability: text("current_availability"),
  amenities: text("amenities", { mode: "json" }),
  photoGallery: text("photo_gallery", { mode: "json" }),
  bookingRules: text("booking_rules"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFacilityBooking = sqliteTable("facility_booking", {
  facilityBookingId: text("facility_booking_id")
    .primaryKey()
    .$default(() => `fb-${ulid()}`),
  facilityId: text("facility_id").references(
    (): AnySQLiteColumn => tableFacility.facilityId,
  ),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  startTime: integer("start_time", { mode: "number" }).notNull(),
  endTime: integer("end_time", { mode: "number" }).notNull(),
  purpose: text("purpose"),
  status: text("status"),
  duration: integer("duration"),
  notes: text("notes"),
  color: text("color"),
  bookingType: text("booking_type"),
  bookingStatus: text("booking_status"),
  revenue: real("revenue"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBarn = sqliteTable("barn", {
  barnId: text("id")
    .primaryKey()
    .$default(() => `b-${ulid()}`),
  name: text("name").notNull(),
  levels: integer("levels").notNull(),
  layout: text("layout", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStallCustomization = sqliteTable("stall_customization", {
  stallCustomizationId: text("id")
    .primaryKey()
    .$default(() => `sc-${ulid()}`),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  customizationType: text("customization_type").notNull(),
  description: text("description"),
  isPermanent: integer("is_permanent", { mode: "boolean" }).default(false),
  installationDate: integer("installation_date", { mode: "number" }).notNull(),
  removalDate: integer("removal_date", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStaffSchedule = sqliteTable("staff_schedule", {
  staffScheduleId: text("id")
    .primaryKey()
    .$default(() => `ss-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  shiftStart: integer("shift_start", { mode: "number" }).notNull(),
  shiftEnd: integer("shift_end", { mode: "number" }).notNull(),
  role: text("role").notNull(),
  assignedArea: text("assigned_area").notNull(),
  colorCode: text("color_code").notNull(),
  notes: text("notes"),
  weekNumber: integer("week_number"),
  month: integer("month"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBudget = sqliteTable("budget", {
  budgetId: text("id")
    .primaryKey()
    .$default(() => `b-${ulid()}`),
  year: integer("year").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  status: text("status").notNull(),
  categories: text("categories", { mode: "json" }),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  name: text("name").notNull(),
  isTemplate: integer("is_template", { mode: "boolean" }).default(false),
  basedOnBudgetId: text("based_on_budget_id").references(
    () => tableBudget.budgetId,
  ),
  plannedTotalIncome: decimal("planned_total_income"),
  plannedTotalExpense: decimal("planned_total_expense"),
});

export const tableBudgetCategory = sqliteTable("budget_category", {
  budgetCategoryId: text("id")
    .primaryKey()
    .$default(() => `bc-${ulid()}`),
  budgetId: text("budget_id").references((): AnySQLiteColumn => tableBudget.budgetId),
  name: text("name").notNull(),
  plannedAmount: decimal("planned_amount").notNull(),
  actualAmount: decimal("actual_amount").notNull(),
  notes: text("notes"),
  month: integer("month"),
  plannedAmountMonthly: decimal("planned_amount_monthly"),
  actualAmountMonthly: decimal("actual_amount_monthly"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFinancialReport = sqliteTable("financial_report", {
  financialReportId: text("id")
    .primaryKey()
    .$default(() => `fr-${ulid()}`),
  reportType: text("report_type").notNull(),
  dateRangeStart: integer("date_range_start", { mode: "number" }).notNull(),
  dateRangeEnd: integer("date_range_end", { mode: "number" }).notNull(),
  generatedAt: integer("generated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  generatedBy: text("generated_by").references((): AnySQLiteColumn => tableUser.userId),
  reportData: text("report_data", { mode: "json" }),
  format: text("format").notNull(),
  name: text("name").notNull(),
  parameters: text("parameters", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableCustomReport = sqliteTable("custom_report", {
  customReportId: text("id")
    .primaryKey()
    .$default(() => `cr-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  name: text("name").notNull(),
  dataPoints: text("data_points", { mode: "json" }),
  groupingOptions: text("grouping_options", { mode: "json" }),
  summaryOptions: text("summary_options", { mode: "json" }),
  isTemplate: integer("is_template", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  chartConfiguration: text("chart_configuration", { mode: "json" }),
  contractSpecificOptions: text("contract_specific_options", {
    mode: "json",
  }),
  reportType: text("report_type"),
  visualizationOptions: text("visualization_options", { mode: "json" }),
});

export const tableScheduledReport = sqliteTable("scheduled_report", {
  scheduledReportId: text("id")
    .primaryKey()
    .$default(() => `sr-${ulid()}`),
  customReportId: text("custom_report_id").references(
    () => tableCustomReport.customReportId,
  ),
  frequency: text("frequency").notNull(),
  nextRunDate: integer("next_run_date", { mode: "number" }).notNull(),
  lastRunDate: integer("last_run_date", { mode: "number" }),
  status: text("status").notNull(),
  scheduleSettings: text("schedule_settings", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableIncomeCategory = sqliteTable("income_category", {
  incomeCategoryId: text("id")
    .primaryKey()
    .$default(() => `ic-${ulid()}`),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  transactionCount: integer("transaction_count").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
  isInUse: integer("is_in_use", { mode: "boolean" }).default(false),
  defaultFor: text("default_for"),
});

export const tableExpenseCategory = sqliteTable("expense_category", {
  expenseCategoryId: text("id")
    .primaryKey()
    .$default(() => `ec-${ulid()}`),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  transactionCount: integer("transaction_count").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
  isInUse: integer("is_in_use", { mode: "boolean" }).default(false),
  defaultFor: text("default_for"),
});

export const tableVisitorDocument = sqliteTable("visitor_document", {
  visitorDocumentId: text("visitor_document_id")
    .primaryKey()
    .$default(() => `vd-${ulid()}`),
  visitorId: text("visitor_id").references(
    (): AnySQLiteColumn => tableVisitor.visitorId,
  ),
  documentType: text("document_type").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadDate: integer("upload_date", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  description: text("description"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedType = sqliteTable("feed_type", {
  feedTypeId: text("id")
    .primaryKey()
    .$default(() => `ft-${ulid()}`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePastureConditionLog = sqliteTable("pasture_condition_log", {
  pastureConditionLogId: text("id")
    .primaryKey()
    .$default(() => `pcl-${ulid()}`),
  pastureId: text("pasture_id").references(
    (): AnySQLiteColumn => tablePasture.pastureId,
  ),
  conditionDate: integer("condition_date", { mode: "number" }).notNull(),
  grassCondition: text("grass_condition").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStallOccupancy = sqliteTable("stall_occupancy", {
  stallOccupancyId: text("stall_occupancy_id")
    .primaryKey()
    .$default(() => `so-${ulid()}`),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  current: integer("current", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableTransaction = sqliteTable("transaction", {
  transactionId: text("id")
    .primaryKey()
    .$default(() => `t-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  date: integer("date", { mode: "number" }).notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  amount: decimal("amount").notNull(),
  description: text("description"),
  colorCode: text("color_code").notNull(),
  tags: text("tags", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableGoals = sqliteTable("goals", {
  goalId: text("goal_id")
    .primaryKey()
    .$default(() => `g-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  goalDescription: text("goal_description").notNull(),
  targetDate: integer("target_date", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableScheduledExercise = sqliteTable("scheduled_exercise", {
  scheduledExerciseId: text("scheduled_exercise_id")
    .primaryKey()
    .$default(() => `se-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  scheduledDate: integer("scheduled_date", { mode: "number" }).notNull(),
  duration: integer("duration").notNull(),
  type: text("type").notNull(),
  intensity: text("intensity").notNull(),
  trainer: text("trainer").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedInventory = sqliteTable("feed_inventory", {
  feedInventoryId: text("id")
    .primaryKey()
    .$default(() => `fi-${ulid()}`),
  feedType: text("feed_type").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  reorderThreshold: integer("reorder_threshold").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedingAlert = sqliteTable("feeding_alert", {
  feedingAlertId: text("id")
    .primaryKey()
    .$default(() => `fa-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  alertType: text("alert_type").notNull(),
  alertTime: integer("alert_time", { mode: "number" }).notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableReportConfiguration = sqliteTable("report_configuration", {
  reportConfigurationId: text("id")
    .primaryKey()
    .$default(() => `rc-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  name: text("name").notNull(),
  reportType: text("report_type").notNull(),
  dateRange: text("date_range", { mode: "json" }),
  filters: text("filters", { mode: "json" }),
  grouping: text("grouping"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableContract = sqliteTable("contract", {
  contractId: text("id")
    .primaryKey()
    .$default(() => `c-${ulid()}`),
  boarderId: text("boarder_id").references((): AnySQLiteColumn => tableBoarder.boarderId),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  termsAndConditions: text("terms_and_conditions").notNull(),
  paymentTerms: text("payment_terms").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableContractDocument = sqliteTable("contract_document", {
  contractDocumentId: text("id")
    .primaryKey()
    .$default(() => `cd-${ulid()}`),
  contractId: text("contract_id").references(
    (): AnySQLiteColumn => tableContract.contractId,
  ),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadDate: integer("upload_date", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  uploadedBy: text("uploaded_by").references((): AnySQLiteColumn => userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableContractNote = sqliteTable("contract_note", {
  contractNoteId: text("id")
    .primaryKey()
    .$default(() => `cn-${ulid()}`),
  contractId: text("contract_id").references(
    (): AnySQLiteColumn => tableContract.contractId,
  ),
  noteText: text("note_text").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
});

export const tableBoardingContract = sqliteTable("boarding_contract", {
  boardingContractId: text("id")
    .primaryKey()
    .$default(() => `bc-${ulid()}`),
  boarderId: text("boarder_id").references(
    (): AnySQLiteColumn => tableBoarder.boarderId,
  ),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  boardingFees: text("boarding_fees", { mode: "json" }).$type<
    Record<string, any>
  >(),
  paymentTerms: text("payment_terms"),
  additionalServices: text("additional_services", { mode: "json" }).$type<
    Record<string, any>
  >(),
  specialConditions: text("special_conditions"),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  termsAndConditions: text("terms_and_conditions"),
  isCurrent: integer("is_current", { mode: "boolean" }).default(false),
  signedContractUrl: text("signed_contract_url"),
  eSignatureStatus: text("e_signature_status"),
});

export const tableContractHorse = sqliteTable("contract_horse", {
  contractHorseId: text("contract_horse_id")
    .primaryKey()
    .$default(() => `ch-${ulid()}`),
  contractId: text("contract_id").references(
    () => tableBoardingContract.boardingContractId,
  ),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableAnnouncement = sqliteTable("announcement", {
  announcementId: text("id")
    .primaryKey()
    .$default(() => `a-${ulid()}`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  scheduledAt: integer("scheduled_at", { mode: "number" }),
  publishedAt: integer("published_at", { mode: "number" }),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  targetGroup: text("target_group", { mode: "json" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const tableAnnouncementView = sqliteTable("announcement_view", {
  announcementViewId: text("id")
    .primaryKey()
    .$default(() => `av-${ulid()}`),
  announcementId: text("announcement_id").references(
    () => tableAnnouncement.announcementId,
  ),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  viewedAt: integer("viewed_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableAnnouncementResponse = sqliteTable("announcement_response", {
  announcementResponseId: text("id")
    .primaryKey()
    .$default(() => `ar-${ulid()}`),
  announcementId: text("announcement_id").references(
    () => tableAnnouncement.announcementId,
  ),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  responseType: text("response_type").notNull(),
  responseContent: text("response_content"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
});

export const tableConversation = sqliteTable("conversation", {
  conversationId: text("id")
    .primaryKey()
    .$default(() => `c-${ulid()}`),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  status: text("status").notNull(),
  isFlagged: integer("is_flagged", { mode: "boolean" }).default(false),
});

export const tableMessage = sqliteTable("message", {
  messageId: text("id")
    .primaryKey()
    .$default(() => `m-${ulid()}`),
  conversationId: text("conversation_id").references(
    () => tableConversation.conversationId,
  ),
  senderId: text("sender_id").references((): AnySQLiteColumn => tableUser.userId),
  content: text("content").notNull(),
  sentAt: integer("sent_at", { mode: "number" }).notNull(),
  hasAttachments: integer("has_attachments", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableConversationParticipant = sqliteTable(
  "conversation_participant",
  {
    conversationParticipantId: text("id")
      .primaryKey()
      .$default(() => `cp-${ulid()}`),
    conversationId: text("conversation_id").references(
      () => tableConversation.conversationId,
    ),
    userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow()),
    updatedAt: integer("updated_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow())
      .$onUpdate(() => unixNow()),
  },
);

export const tableMessageAttachment = sqliteTable("message_attachment", {
  messageAttachmentId: text("id")
    .primaryKey()
    .$default(() => `ma-${ulid()}`),
  messageId: text("message_id").references(
    (): AnySQLiteColumn => tableMessage.messageId,
  ),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBoarderDocument = sqliteTable("boarder_document", {
  boarderDocumentId: text("boarder_document_id")
    .primaryKey()
    .$default(() => `bd-${ulid()}`),
  boarderId: text("boarder_id").references(
    (): AnySQLiteColumn => tableBoarder.boarderId,
  ),
  documentType: text("document_type").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadDate: integer("upload_date", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  description: text("description"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBoarderChangeLog = sqliteTable("boarder_change_log", {
  boarderChangeLogId: text("id")
    .primaryKey()
    .$default(() => `bcl-${ulid()}`),
  boarderId: text("boarder_id").references(
    (): AnySQLiteColumn => tableBoarder.boarderId,
  ),
  changedByUserId: text("changed_by_user_id").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
  changeDate: integer("change_date", { mode: "number" }).notNull(),
  changes: text("changes", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStaff = sqliteTable("staff", {
  staffId: text("user_id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  position: text("position").notNull(),
  hireDate: integer("hire_date", { mode: "number" }).notNull(),
  schedule: text("schedule", { mode: "json" }).$type<Record<string, any>>(),
  status: text("status"),
  availability: text("availability", { mode: "json" }).$type<
    Record<string, any>
  >(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableShift = sqliteTable("shift", {
  shiftId: text("id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  staffId: text("staff_id").references((): AnySQLiteColumn => tableStaff.staffId),
  startTime: integer("start_time", { mode: "number" }).notNull(),
  endTime: integer("end_time", { mode: "number" }).notNull(),
  position: text("position").notNull(),
  notes: text("notes"),
  status: text("status"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableNotification = sqliteTable("notification", {
  notificationId: text("notification_id")
    .primaryKey()
    .$default(() => `n-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  message: text("message").notNull(),
  type: text("type").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableSearchIndex = sqliteTable("search_index", {
  searchIndexId: text("search_index_id")
    .primaryKey()
    .$default(() => `si-${ulid()}`),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableRelatedItem = sqliteTable("related_item", {
  relatedItemId: text("related_item_id")
    .primaryKey()
    .$default(() => `ri-${ulid()}`),
  itemId: text("item_id").references(
    (): AnySQLiteColumn => tableInventoryItem.inventoryItemId,
  ),
  relationshipType: text("relationship_type").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableTrainer = sqliteTable("trainer", {
  trainerId: text("id")
    .primaryKey()
    .$default(() => `t-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  specializations: text("specializations", { mode: "json" }),
  certifications: text("certifications", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExerciseType = sqliteTable("exercise_type", {
  exerciseTypeId: text("id")
    .primaryKey()
    .$default(() => `et-${ulid()}`),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInventoryCategory = sqliteTable("inventory_category", {
  inventoryCategoryId: text("id")
    .primaryKey()
    .$default(() => `ic-${ulid()}`),
  name: text("name").notNull(),
  parentId: text("parent_id").references(
    (): AnySQLiteColumn => tableInventoryCategory.inventoryCategoryId,
  ),
  description: text("description"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInventoryItemCategoryChange = sqliteTable(
  "inventory_item_category_change",
  {
    inventoryItemCategoryChangeId: text("id")
      .primaryKey()
      .$default(() => `iicc-${ulid()}`),
    inventoryItemId: text("item_id").references(
      (): AnySQLiteColumn => tableInventoryItem.inventoryItemId,
    ),
    oldCategoryId: text("old_category_id").references(
      () => tableInventoryCategory.inventoryCategoryId,
    ),
    newCategoryId: text("new_category_id").references(
      () => tableInventoryCategory.inventoryCategoryId,
    ),
    changeDate: integer("change_date", { mode: "number" }).notNull(),
    changedBy: text("changed_by").references((): AnySQLiteColumn => userId),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow()),
    updatedAt: integer("updated_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow())
      .$onUpdate(() => unixNow()),
  },
);

export const tableSupplier = sqliteTable("supplier", {
  supplierId: text("id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  name: text("name").notNull(),
  contactInformation: text("contact_information", { mode: "json" }),
  lastOrderDate: integer("last_order_date", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableSupplierOrder = sqliteTable("supplier_order", {
  supplierOrderId: text("id")
    .primaryKey()
    .$default(() => `so-${ulid()}`),
  supplierId: text("supplier_id").references(
    (): AnySQLiteColumn => tableSupplier.supplierId,
  ),
  orderDate: integer("order_date", { mode: "number" }).notNull(),
  orderDetails: text("order_details", { mode: "json" }).$type<
    Record<string, any>
  >(),
  totalAmount: real("total_amount").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableTimeOffRequest = sqliteTable("time_off_request", {
  timeOffRequestId: text("id")
    .primaryKey()
    .$default(() => `tor-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableShiftChangeRequest = sqliteTable("shift_change_request", {
  shiftChangeRequestId: text("id")
    .primaryKey()
    .$default(() => `scr-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  originalShiftId: text("original_shift_id").references(
    () => tableStaffSchedule.staffScheduleId,
  ),
  requestedStartTime: integer("requested_start_time", { mode: "number" })
    .notNull(),
  requestedEndTime: integer("requested_end_time", { mode: "number" })
    .notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableSchedule = sqliteTable("schedule", {
  scheduleId: text("id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  name: text("name").notNull(),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableScheduleChangeLog = sqliteTable("schedule_change_log", {
  scheduleChangeLogId: text("id")
    .primaryKey()
    .$default(() => `scl-${ulid()}`),
  scheduleId: text("schedule_id").references(
    (): AnySQLiteColumn => tableSchedule.scheduleId,
  ),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  changeType: text("change_type").notNull(),
  changeDetails: text("change_details", { mode: "json" }),
  timestamp: integer("timestamp", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
});

export const tableScheduleTemplate = sqliteTable("schedule_template", {
  scheduleTemplateId: text("id")
    .primaryKey()
    .$default(() => `st-${ulid()}`),
  name: text("name").notNull(),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  templateData: text("template_data", { mode: "json" }),
});

export const tableStallActivity = sqliteTable("stall_activity", {
  stallActivityId: text("id")
    .primaryKey()
    .$default(() => `sa-${ulid()}`),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  activityType: text("activity_type").notNull(),
  activityDate: integer("activity_date", { mode: "number" }).notNull(),
  description: text("description"),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBarnLayout = sqliteTable("barn_layout", {
  barnLayoutId: text("id")
    .primaryKey()
    .$default(() => `bl-${ulid()}`),
  barnId: text("barn_id").references((): AnySQLiteColumn => tableBarn.barnId),
  layoutData: text("layout_data", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStallReport = sqliteTable("stall_report", {
  stallReportId: text("id")
    .primaryKey()
    .$default(() => `sr-${ulid()}`),
  reportDate: integer("report_date", { mode: "number" }).notNull(),
  reportData: text("report_data", { mode: "json" }).$type<Record<string, any>>(),
  generatedBy: text("generated_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableStallAssignment = sqliteTable("stall_assignment", {
  stallAssignmentId: text("id")
    .primaryKey()
    .$default(() => `sa-${ulid()}`),
  stallId: text("stall_id").references((): AnySQLiteColumn => tableStall.stallId),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }),
  notes: text("notes"),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
});

export const tableFacilityPhoto = sqliteTable("facility_photo", {
  facilityPhotoId: text("id")
    .primaryKey()
    .$default(() => `fp-${ulid()}`),
  facilityId: text("facility_id").references(
    (): AnySQLiteColumn => tableFacility.facilityId,
  ),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  order: integer("order").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFacilityChangeLog = sqliteTable("facility_change_log", {
  facilityChangeLogId: text("id")
    .primaryKey()
    .$default(() => `fcl-${ulid()}`),
  facilityId: text("facility_id").references(
    (): AnySQLiteColumn => tableFacility.facilityId,
  ),
  changedByUserId: text("changed_by_user_id").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
  changeDate: integer("change_date", { mode: "number" }).notNull(),
  changes: text("changes", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFacilityAvailability = sqliteTable("facility_availability", {
  facilityAvailabilityId: text("facility_availability_id")
    .primaryKey()
    .$default(() => `fa-${ulid()}`),
  facilityId: text("facility_id").references(
    (): AnySQLiteColumn => tableFacility.facilityId,
  ),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: integer("start_time", { mode: "number" }).notNull(),
  endTime: integer("end_time", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedingChangeLog = sqliteTable("feeding_change_log", {
  feedingChangeLogId: text("id")
    .primaryKey()
    .$default(() => `fcl-${ulid()}`),
  feedingScheduleId: text("feeding_schedule_id").references(
    () => tableFeedingSchedule.feedingScheduleId,
  ),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  changeDate: integer("change_date", { mode: "number" }).notNull(),
  changeDescription: text("change_description").notNull(),
  oldValue: text("old_value", { mode: "json" }).$type<Record<string, any>>(),
  newValue: text("new_value", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableFeedingHistory = sqliteTable("feeding_history", {
  feedingHistoryId: text("id")
    .primaryKey()
    .$default(() => `fh-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  feedType: text("feed_type").notNull(),
  quantity: integer("quantity").notNull(),
  feedingTime: integer("feeding_time", { mode: "number" }).notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableHealthReminder = sqliteTable("health_reminder", {
  healthReminderId: text("id")
    .primaryKey()
    .$default(() => `hr-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  reminderDate: integer("reminder_date", { mode: "number" }).notNull(),
  eventType: text("event_type").notNull(),
  description: text("description"),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableVetNote = sqliteTable("vet_note", {
  vetNoteId: text("id")
    .primaryKey()
    .$default(() => `vn-${ulid()}`),
  healthRecordId: text("health_record_id").references(
    () => tableHealthRecord.healthRecordId,
  ),
  noteContent: text("note_content").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
});

export const tableExerciseStats = sqliteTable("exercise_stats", {
  exerciseStatsId: text("id")
    .primaryKey()
    .$default(() => `es-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  totalExerciseTimeMonth: integer("total_exercise_time_month").notNull(),
  mostFrequentActivity: text("most_frequent_activity"),
  notableAchievements: text("notable_achievements", { mode: "json" }),
  lastUpdated: integer("last_updated", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExerciseReport = sqliteTable("exercise_report", {
  exerciseReportId: text("id")
    .primaryKey()
    .$default(() => `er-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  reportName: text("report_name").notNull(),
  horses: text("horses", { mode: "json" }).$type<Record<string, any>>(),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  reportParameters: text("report_parameters", { mode: "json" }).$type<
    Record<string, any>
  >(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableAutomatedReport = sqliteTable("automated_report", {
  automatedReportId: text("id")
    .primaryKey()
    .$default(() => `ar-${ulid()}`),
  exerciseReportId: text("exercise_report_id").references(
    () => tableExerciseReport.exerciseReportId,
  ),
  frequency: text("frequency").notNull(),
  nextRunDate: integer("next_run_date", { mode: "number" }).notNull(),
  recipientEmails: text("recipient_emails", { mode: "json" }).$type<
    string[]
  >(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExerciseGoal = sqliteTable("exercise_goal", {
  exerciseGoalId: text("id")
    .primaryKey()
    .$default(() => `eg-${ulid()}`),
  horseId: text("horse_id").references((): AnySQLiteColumn => tableHorse.horseId),
  goalDescription: text("goal_description").notNull(),
  targetDate: integer("target_date", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePastureMaintenance = sqliteTable("pasture_maintenance", {
  pastureMaintenanceId: text("id")
    .primaryKey()
    .$default(() => `pm-${ulid()}`),
  pastureId: text("pasture_id").references(
    (): AnySQLiteColumn => tablePasture.pastureId,
  ),
  maintenanceDate: integer("maintenance_date", { mode: "number" }).notNull(),
  maintenanceType: text("maintenance_type").notNull(),
  description: text("description"),
  performedBy: text("performed_by").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tablePastureRotationPlan = sqliteTable("pasture_rotation_plan", {
  pastureRotationPlanId: text("id")
    .primaryKey()
    .$default(() => `prp-${ulid()}`),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const tablePastureRotationPlanDetail = sqliteTable(
  "pasture_rotation_plan_detail",
  {
    pastureRotationPlanDetailId: text("id")
      .primaryKey()
      .$default(() => `prpd-${ulid()}`),
    planId: text("plan_id").references(
      () => tablePastureRotationPlan.pastureRotationPlanId,
    ),
    pastureId: text("pasture_id").references(
      (): AnySQLiteColumn => tablePasture.pastureId,
    ),
    startDate: integer("start_date", { mode: "number" }).notNull(),
    endDate: integer("end_date", { mode: "number" }).notNull(),
    horses: text("horses", { mode: "json" }).$type<string[]>(),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow()),
    updatedAt: integer("updated_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow())
      .$onUpdate(() => unixNow()),
  },
);

export const tablePastureActionLog = sqliteTable("pasture_action_log", {
  pastureActionLogId: text("id")
    .primaryKey()
    .$default(() => `pal-${ulid()}`),
  pastureId: text("pasture_id").references(
    (): AnySQLiteColumn => tablePasture.pastureId,
  ),
  actionType: text("action_type").notNull(),
  actionDate: integer("action_date", { mode: "number" }).notNull(),
  description: text("description"),
  performedBy: text("performed_by").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBudgetAlert = sqliteTable("budget_alert", {
  budgetAlertId: text("id")
    .primaryKey()
    .$default(() => `ba-${ulid()}`),
  budgetId: text("budget_id").references((): AnySQLiteColumn => tableBudget.budgetId),
  categoryId: text("category_id").references(
    (): AnySQLiteColumn => tableBudgetCategory.categoryId,
  ),
  alertType: text("alert_type").notNull(),
  threshold: decimal("threshold").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const tableBudgetAdjustment = sqliteTable("budget_adjustment", {
  budgetAdjustmentId: text("id")
    .primaryKey()
    .$default(() => `ba-${ulid()}`),
  budgetCategoryId: text("budget_category_id").references(
    () => tableBudgetCategory.budgetCategoryId,
  ),
  adjustmentAmount: decimal("adjustment_amount").notNull(),
  adjustmentDate: integer("adjustment_date", { mode: "number" }).notNull(),
  reason: text("reason").notNull(),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBudgetComparison = sqliteTable("budget_comparison", {
  budgetComparisonId: text("id")
    .primaryKey()
    .$default(() => `bc-${ulid()}`),
  currentBudgetId: text("current_budget_id").references(
    () => tableBudget.budgetId,
  ),
  previousBudgetId: text("previous_budget_id").references(
    () => tableBudget.budgetId,
  ),
  comparisonData: text("comparison_data", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBudgetVersion = sqliteTable("budget_version", {
  budgetVersionId: text("id")
    .primaryKey()
    .$default(() => `bv-${ulid()}`),
  budgetId: text("budget_id").references((): AnySQLiteColumn => tableBudget.budgetId),
  versionName: text("version_name").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
});

export const tableBudgetExport = sqliteTable("budget_export", {
  budgetExportId: text("id")
    .primaryKey()
    .$default(() => `be-${ulid()}`),
  budgetId: text("budget_id").references((): AnySQLiteColumn => tableBudget.budgetId),
  exportDate: integer("export_date", { mode: "number" }).notNull(),
  fileFormat: text("file_format").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableBillingConfiguration = sqliteTable("billing_configuration", {
  billingConfigurationId: text("id")
    .primaryKey()
    .$default(() => `bc-${ulid()}`),
  defaultPaymentTerms: text("default_payment_terms"),
  taxRate: real("tax_rate"),
  standardServiceRates: text("standard_service_rates", { mode: "json" }),
  automaticBillingEnabled: integer("automatic_billing_enabled", {
    mode: "boolean",
  }).default(false),
  acceptedPaymentMethods: text("accepted_payment_methods", { mode: "json" }),
  invoiceEmailTemplate: text("invoice_email_template"),
  reminderEmailTemplate: text("reminder_email_template"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  lastModifiedBy: text("last_modified_by").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
});

export const tableContractHistory = sqliteTable("contract_history", {
  contractHistoryId: text("id")
    .primaryKey()
    .$default(() => `ch-${ulid()}`),
  boarderId: text("boarder_id").references((): AnySQLiteColumn => tableBoarder.boarderId),
  contractId: text("contract_id").references(
    () => tableBoardingContract.boardingContractId,
  ),
  startDate: integer("start_date", { mode: "number" }).notNull(),
  endDate: integer("end_date", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableContractAction = sqliteTable("contract_action", {
  contractActionId: text("id")
    .primaryKey()
    .$default(() => `ca-${ulid()}`),
  contractId: text("contract_id").references(
    () => tableBoardingContract.boardingContractId,
  ),
  actionType: text("action_type").notNull(),
  performedBy: text("performed_by").references((): AnySQLiteColumn => userId),
  actionDate: integer("action_date", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableContractTemplate = sqliteTable("contract_template", {
  contractTemplateId: text("id")
    .primaryKey()
    .$default(() => `ct-${ulid()}`),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  createdByUserId: text("created_by_user_id").references(
    (): AnySQLiteColumn => tableUser.userId,
  ),
});

export const tableContractVersion = sqliteTable("contract_version", {
  contractVersionId: text("id")
    .primaryKey()
    .$default(() => `cv-${ulid()}`),
  contractId: text("contract_id").references(
    () => tableBoardingContract.boardingContractId,
  ),
  versionNumber: integer("version_number").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  changes: text("changes", { mode: "json" }).$type<Record<string, any>>(),
});

export const tableCustomTransactionCategory = sqliteTable(
  "custom_transaction_category",
  {
    customTransactionCategoryId: text("id")
      .primaryKey()
      .$default(() => `ctc-${ulid()}`),
    userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
    name: text("name").notNull(),
    type: text("type").notNull(),
    color: text("color").notNull(),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow()),
    updatedAt: integer("updated_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow())
      .$onUpdate(() => unixNow()),
  },
);

export const tableBatchOperation = sqliteTable("batch_operation", {
  batchOperationId: text("id")
    .primaryKey()
    .$default(() => `bo-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  operationType: text("operation_type").notNull(),
  affectedTransactions: text("affected_transactions", { mode: "json" }),
  datePerformed: integer("date_performed", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableExportHistory = sqliteTable("export_history", {
  exportHistoryId: text("id")
    .primaryKey()
    .$default(() => `eh-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  exportDate: integer("export_date", { mode: "number" }).notNull(),
  exportType: text("export_type").notNull(),
  dataRange: text("data_range", { mode: "json" }),
  fileUrl: text("file_url").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableSavedReport = sqliteTable("saved_report", {
  savedReportId: text("id")
    .primaryKey()
    .$default(() => `sr-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  reportName: text("report_name").notNull(),
  reportType: text("report_type").notNull(),
  parameters: text("parameters", { mode: "json" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  lastAccessed: integer("last_accessed", { mode: "number" }),
});

export const tableReportTemplate = sqliteTable("report_template", {
  reportTemplateId: text("id")
    .primaryKey()
    .$default(() => `rt-${ulid()}`),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(),
  configuration: text("configuration", { mode: "json" }),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableReportExport = sqliteTable("report_export", {
  reportExportId: text("id")
    .primaryKey()
    .$default(() => `re-${ulid()}`),
  reportId: text("report_id").references(
    (): AnySQLiteColumn => tableCustomReport.customReportId,
  ),
  exportDate: integer("export_date", { mode: "number" }).notNull(),
  fileFormat: text("file_format").notNull(),
  fileUrl: text("file_url").notNull(),
  createdBy: text("created_by").references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableMaintenanceCategory = sqliteTable("maintenance_category", {
  maintenanceCategoryId: text("id")
    .primaryKey()
    .$default(() => `mc-${ulid()}`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableReorderHistory = sqliteTable("reorder_history", {
  reorderHistoryId: text("id")
    .primaryKey()
    .$default(() => `rh-${ulid()}`),
  itemId: text("item_id").references(
    (): AnySQLiteColumn => tableInventoryItem.inventoryItemId,
  ),
  reorderDate: integer("reorder_date", { mode: "number" }).notNull(),
  quantityOrdered: integer("quantity_ordered").notNull(),
  supplier: text("supplier").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableInventoryMaintenanceRequest = sqliteTable(
  "inventory_maintenance_request",
  {
    inventoryMaintenanceRequestId: text("id")
      .primaryKey()
      .$default(() => `imr-${ulid()}`),
    itemId: text("item_id").references(
      (): AnySQLiteColumn => tableInventoryItem.inventoryItemId,
    ),
    maintenanceRequestId: text("maintenance_request_id").references(
      () => tableMaintenanceRequest.maintenanceRequestId,
    ),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow()),
    updatedAt: integer("updated_at", { mode: "number" })
      .notNull()
      .$defaultFn(() => unixNow())
      .$onUpdate(() => unixNow()),
  },
);

export const tableStaffRole = sqliteTable("staff_role", {
  staffRoleId: text("id")
    .primaryKey()
    .$default(() => `sr-${ulid()}`),
  name: text("name").notNull(),
  colorCode: text("color_code").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableScheduledVisit = sqliteTable("scheduled_visit", {
  scheduledVisitId: text("id")
    .primaryKey()
    .$default(() => `sv-${ulid()}`),
  visitorId: text("visitor_id").references(
    (): AnySQLiteColumn => tableVisitor.visitorId,
  ),
  scheduledDate: integer("scheduled_date", { mode: "number" }).notNull(),
  purpose: text("purpose").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableVisitorType = sqliteTable("visitor_type", {
  visitorTypeId: text("id")
    .primaryKey()
    .$default(() => `vt-${ulid()}`),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});

export const tableMaintenanceReport = sqliteTable("maintenance_report", {
  maintenanceReportId: text("id")
    .primaryKey()
    .$default(() => `mr-${ulid()}`),
  userId: text("user_id").references((): AnySQLiteColumn => tableUser.userId),
  reportType: text("report_type").notNull(),
  dateRangeStart: integer("date_range_start", { mode: "number" }).notNull(),
  dateRangeEnd: integer("date_range_end", { mode: "number" }).notNull(),
  filters: text("filters", { mode: "json" }),
  generatedAt: integer("generated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  reportData: text("report_data", { mode: "json" }).notNull(),
  exportFormat: text("export_format").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
});





export const userRelations = relations(tableUser, ({ many }) => ({
  horses: many(tableHorse),
  boarders: many(tableBoarder),
  maintenanceRequests: many(tableMaintenanceRequest),
  invoices: many(tableInvoice),
  payments: many(tablePayment),
  expenses: many(tableExpense),
  incomes: many(tableIncome),
}));

export const horseRelations = relations(tableHorse, ({ one, many }) => ({
  owner: one(tableUser, { fields: [tableHorse.ownerId], references: [tableUser.userId] }),
  stall: one(tableStall, { fields: [tableHorse.stallId], references: [tableStall.stallId] }),
  healthRecords: many(tableHealthRecord),
  exerciseLogs: many(tableExerciseLog),
  feedingSchedules: many(tableFeedingSchedule),
}));

export const boarderRelations = relations(tableBoarder, ({ one, many }) => ({
  user: one(tableUser, { fields: [tableBoarder.userId], references: [tableUser.userId] }),
  horses: many(tableHorse),
  invoices: many(tableInvoice),
  payments: many(tablePayment),
}));

export const stallRelations = relations(tableStall, ({ one, many }) => ({
  horse: one(tableHorse),
  maintenanceTasks: many(tableMaintenanceTask),
  stallCustomizations: many(tableStallCustomization),
}));

export const healthRecordRelations = relations(tableHealthRecord, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableHealthRecord.horseId], references: [tableHorse.horseId] }),
}));

export const exerciseLogRelations = relations(tableExerciseLog, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableExerciseLog.horseId], references: [tableHorse.horseId] }),
  trainer: one(tableUser, { fields: [tableExerciseLog.trainer], references: [tableUser.userId] }),
}));

export const feedingScheduleRelations = relations(tableFeedingSchedule, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableFeedingSchedule.horseId], references: [tableHorse.horseId] }),
}));

export const maintenanceTaskRelations = relations(tableMaintenanceTask, ({ one }) => ({
  stall: one(tableStall, { fields: [tableMaintenanceTask.stallId], references: [tableStall.stallId] }),
}));

export const maintenanceRequestRelations = relations(tableMaintenanceRequest, ({ one }) => ({
  requestor: one(tableUser, { fields: [tableMaintenanceRequest.userId], references: [tableUser.userId] }),
  assignedStaff: one(tableUser, { fields: [tableMaintenanceRequest.assignedStaffId], references: [tableUser.userId] }),
}));

export const invoiceRelations = relations(tableInvoice, ({ one, many }) => ({
  boarder: one(tableBoarder, { fields: [tableInvoice.boarderId], references: [tableBoarder.boarderId] }),
  payments: many(tablePayment),
}));

export const paymentRelations = relations(tablePayment, ({ one }) => ({
  boarder: one(tableBoarder, { fields: [tablePayment.boarderId], references: [tableBoarder.boarderId] }),
  invoice: one(tableInvoice, { fields: [tablePayment.invoiceId], references: [tableInvoice.invoiceId] }),
}));

export const expenseRelations = relations(tableExpense, ({ one }) => ({
  user: one(tableUser, { fields: [tableExpense.userId], references: [tableUser.userId] }),
}));

export const incomeRelations = relations(tableIncome, ({ one }) => ({
  user: one(tableUser, { fields: [tableIncome.userId], references: [tableUser.userId] }),
}));

export const inventoryItemRelations = relations(tableInventoryItem, ({ many }) => ({
  inventoryTransactions: many(tableInventoryTransaction),
}));

export const inventoryTransactionRelations = relations(tableInventoryTransaction, ({ one }) => ({
  inventoryItem: one(tableInventoryItem, { fields: [tableInventoryTransaction.itemId], references: [tableInventoryItem.inventoryItemId] }),
  user: one(tableUser, { fields: [tableInventoryTransaction.userId], references: [tableUser.userId] }),
}));

export const pastureRelations = relations(tablePasture, ({ many }) => ({
  pastureRotations: many(tablePastureRotation),
}));

export const pastureRotationRelations = relations(tablePastureRotation, ({ one }) => ({
  pasture: one(tablePasture, { fields: [tablePastureRotation.pastureId], references: [tablePasture.pastureId] }),
}));

export const visitorRelations = relations(tableVisitor, ({ one, many }) => ({
  boarder: one(tableBoarder, { fields: [tableVisitor.associatedBoarderId], references: [tableBoarder.boarderId] }),
  visits: many(tableVisit),
  visitorDocuments: many(tableVisitorDocument),
}));

export const visitRelations = relations(tableVisit, ({ one }) => ({
  visitor: one(tableVisitor, { fields: [tableVisit.visitorId], references: [tableVisitor.visitorId] }),
  horse: one(tableHorse, { fields: [tableVisit.associatedHorseId], references: [tableHorse.horseId] }),
}));

export const eventRelations = relations(tableEvent, ({ many }) => ({
  eventParticipants: many(tableEventParticipant),
}));

export const eventParticipantRelations = relations(tableEventParticipant, ({ one }) => ({
  event: one(tableEvent, { fields: [tableEventParticipant.eventId], references: [tableEvent.eventId] }),
  user: one(tableUser, { fields: [tableEventParticipant.userId], references: [tableUser.userId] }),
}));

export const facilityRelations = relations(tableFacility, ({ many }) => ({
  facilityBookings: many(tableFacilityBooking),
}));

export const facilityBookingRelations = relations(tableFacilityBooking, ({ one }) => ({
  facility: one(tableFacility, { fields: [tableFacilityBooking.facilityId], references: [tableFacility.facilityId] }),
  user: one(tableUser, { fields: [tableFacilityBooking.userId], references: [tableUser.userId] }),
}));

export const barnRelations = relations(tableBarn, ({ many }) => ({
  stalls: many(tableStall),
}));

export const stallCustomizationRelations = relations(tableStallCustomization, ({ one }) => ({
  stall: one(tableStall, { fields: [tableStallCustomization.stallId], references: [tableStall.stallId] }),
}));

export const staffScheduleRelations = relations(tableStaffSchedule, ({ one }) => ({
  user: one(tableUser, { fields: [tableStaffSchedule.userId], references: [tableUser.userId] }),
}));

export const budgetRelations = relations(tableBudget, ({ one, many }) => ({
  user: one(tableUser, { fields: [tableBudget.userId], references: [tableUser.userId] }),
  budgetCategories: many(tableBudgetCategory),
}));

export const budgetCategoryRelations = relations(tableBudgetCategory, ({ one }) => ({
  budget: one(tableBudget, { fields: [tableBudgetCategory.budgetId], references: [tableBudget.budgetId] }),
}));

export const financialReportRelations = relations(tableFinancialReport, ({ one }) => ({
  user: one(tableUser, { fields: [tableFinancialReport.generatedBy], references: [tableUser.userId] }),
}));

export const customReportRelations = relations(tableCustomReport, ({ one }) => ({
  user: one(tableUser, { fields: [tableCustomReport.userId], references: [tableUser.userId] }),
}));

export const scheduledReportRelations = relations(tableScheduledReport, ({ one }) => ({
  customReport: one(tableCustomReport, { fields: [tableScheduledReport.customReportId], references: [tableCustomReport.customReportId] }),
}));

export const incomeCategoryRelations = relations(tableIncomeCategory, ({ many }) => ({
  incomes: many(tableIncome),
}));

export const expenseCategoryRelations = relations(tableExpenseCategory, ({ many }) => ({
  expenses: many(tableExpense),
}));

export const visitorDocumentRelations = relations(tableVisitorDocument, ({ one }) => ({
  visitor: one(tableVisitor, { fields: [tableVisitorDocument.visitorId], references: [tableVisitor.visitorId] }),
}));

export const feedTypeRelations = relations(tableFeedType, ({ many }) => ({
  feedingSchedules: many(tableFeedingSchedule),
}));

export const pastureConditionLogRelations = relations(tablePastureConditionLog, ({ one }) => ({
  pasture: one(tablePasture, { fields: [tablePastureConditionLog.pastureId], references: [tablePasture.pastureId] }),
}));

export const stallOccupancyRelations = relations(tableStallOccupancy, ({ one }) => ({
  stall: one(tableStall, { fields: [tableStallOccupancy.stallId], references: [tableStall.stallId] }),
  horse: one(tableHorse, { fields: [tableStallOccupancy.horseId], references: [tableHorse.horseId] }),
}));

export const transactionRelations = relations(tableTransaction, ({ one }) => ({
  user: one(tableUser, { fields: [tableTransaction.userId], references: [tableUser.userId] }),
}));

export const goalsRelations = relations(tableGoals, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableGoals.horseId], references: [tableHorse.horseId] }),
}));

export const scheduledExerciseRelations = relations(tableScheduledExercise, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableScheduledExercise.horseId], references: [tableHorse.horseId] }),
  trainer: one(tableUser, { fields: [tableScheduledExercise.trainer], references: [tableUser.userId] }),
}));

export const feedInventoryRelations = relations(tableFeedInventory, ({ many }) => ({
  feedingSchedules: many(tableFeedingSchedule),
}));

export const feedingAlertRelations = relations(tableFeedingAlert, ({ one }) => ({
  horse: one(tableHorse, { fields: [tableFeedingAlert.horseId], references: [tableHorse.horseId] }),
}));

export const reportConfigurationRelations = relations(tableReportConfiguration, ({ one }) => ({
  user: one(tableUser, { fields: [tableReportConfiguration.userId], references: [tableUser.userId] }),
}));

export const contractRelations = relations(tableContract, ({ one, many }) => ({
  boarder: one(tableBoarder, { fields: [tableContract.boarderId], references: [tableBoarder.boarderId] }),
  contractDocuments: many(tableContractDocument),
  contractNotes: many(tableContractNote),
}));

export const contractDocumentRelations = relations(tableContractDocument, ({ one }) => ({
  contract: one(tableContract, { fields: [tableContractDocument.contractId], references: [tableContract.contractId] }),
  user: one(tableUser, { fields: [tableContractDocument.uploadedBy], references: [tableUser.userId] }),
}));

export const contractNoteRelations = relations(tableContractNote, ({ one }) => ({
  contract: one(tableContract, { fields: [tableContractNote.contractId], references: [tableContract.contractId] }),
  user: one(tableUser, { fields: [tableContractNote.createdBy], references: [tableUser.userId] }),
}));

export const boardingContractRelations = relations(tableBoardingContract, ({ one, many }) => ({
  boarder: one(tableBoarder, { fields: [tableBoardingContract.boarderId], references: [tableBoarder.boarderId] }),
  contractHorses: many(tableContractHorse),
  invoices: many(tableInvoice),
}));

export const contractHorseRelations = relations(tableContractHorse, ({ one }) => ({
  boardingContract: one(tableBoardingContract, { fields: [tableContractHorse.contractId], references: [tableBoardingContract.boardingContractId] }),
  horse: one(tableHorse, { fields: [tableContractHorse.horseId], references: [tableHorse.horseId] }),
}));

export const announcementRelations = relations(tableAnnouncement, ({ one, many }) => ({
  user: one(tableUser, { fields: [tableAnnouncement.createdBy], references: [tableUser.userId] }),
  announcementViews: many(tableAnnouncementView),
  announcementResponses: many(tableAnnouncementResponse),
}));

export const announcementViewRelations = relations(tableAnnouncementView, ({ one }) => ({
  announcement: one(tableAnnouncement, { fields: [tableAnnouncementView.announcementId], references: [tableAnnouncement.announcementId] }),
  user: one(tableUser, { fields: [tableAnnouncementView.userId], references: [tableUser.userId] }),
}));

export const announcementResponseRelations = relations(tableAnnouncementResponse, ({ one }) => ({
  announcement: one(tableAnnouncement, { fields: [tableAnnouncementResponse.announcementId], references: [tableAnnouncement.announcementId] }),
  user: one(tableUser, { fields: [tableAnnouncementResponse.userId], references: [tableUser.userId] }),
}));

export const conversationRelations = relations(tableConversation, ({ many }) => ({
  messages: many(tableMessage),
  conversationParticipants: many(tableConversationParticipant),
}));

export const messageRelations = relations(tableMessage, ({ one }) => ({
  conversation: one(tableConversation, { fields: [tableMessage.conversationId], references: [tableConversation.conversationId] }),
  user: one(tableUser, { fields: [tableMessage.senderId], references: [tableUser.userId] }),
}));

export const conversationParticipantRelations = relations(tableConversationParticipant, ({ one }) => ({
  conversation: one(tableConversation, { fields: [tableConversationParticipant.conversationId], references: [tableConversation.conversationId] }),
  user: one(tableUser, { fields: [tableConversationParticipant.userId], references: [tableUser.userId] }),
}));

export const messageAttachmentRelations = relations(tableMessageAttachment, ({ one }) => ({
  message: one(tableMessage, { fields: [tableMessageAttachment.messageId], references: [tableMessage.messageId] }),
}));

export const boarderDocumentRelations = relations(tableBoarderDocument, ({ one }) => ({
  boarder: one(tableBoarder, { fields: [tableBoarderDocument.boarderId], references: [tableBoarder.boarderId] }),
}));

export const boarderChangeLogRelations = relations(tableBoarderChangeLog, ({ one }) => ({
  boarder: one(tableBoarder, { fields: [tableBoarderChangeLog.boarderId], references: [tableBoarder.boarderId] }),
  changedByUser: one(tableUser, { fields: [tableBoarderChangeLog.changedByUserId], references: [tableUser.userId] }),
}));

export const staffRelations = relationsexport const staffRelations = relations(tableStaff, ({ one }) => ({
  user: one(tableUser, { fields: [tableStaff.staffId], references: [tableUser.userId] }),
}));

export const shiftRelations = relations(tableShift, ({ one }) => ({
  staff: one(tableStaff, { fields: [tableShift.staffId], references: [tableStaff.staffId] }),
}));

export const notificationRelations = relations(tableNotification, ({ one }) => ({
  user: one(tableUser, { fields: [tableNotification.userId], references: [tableUser.userId] }),
}));

export const relatedItemRelations = relations(tableRelatedItem, ({ one }) => ({
  item: one(tableInventoryItem, { fields: [tableRelatedItem.itemId], references: [tableInventoryItem.inventoryItemId] }),
  relatedItem: one(tableInventoryItem, { fields: [tableRelatedItem.relatedItemId], references: [tableInventoryItem.inventoryItemId] }),
}));

export const trainerRelations = relations(tableTrainer, ({ one }) => ({
  user: one(tableUser, { fields: [tableTrainer.userId], references: [tableUser.userId] }),
}));

export const exerciseTypeRelations = relations(tableExerciseType, ({ many }) => ({
  exerciseLogs: many(tableExerciseLog),
}));

export type UserInsert = typeof tableUser.$inferInsert;
export type UserUpdate = Partial<typeof tableUser.$inferSelect>;
export type User = typeof tableUser.$inferSelect;

export type HorseInsert = typeof tableHorse.$inferInsert;
export type HorseUpdate = Partial<typeof tableHorse.$inferSelect>;
export type Horse = typeof tableHorse.$inferSelect;

export type BoarderInsert = typeof tableBoarder.$inferInsert;
export type BoarderUpdate = Partial<typeof tableBoarder.$inferSelect>;
export type Boarder = typeof tableBoarder.$inferSelect;

export type StallInsert = typeof tableStall.$inferInsert;
export type StallUpdate = Partial<typeof tableStall.$inferSelect>;
export type Stall = typeof tableStall.$inferSelect;

export type HealthRecordInsert = typeof tableHealthRecord.$inferInsert;
export type HealthRecordUpdate = Partial<typeof tableHealthRecord.$inferSelect>;
export type HealthRecord = typeof tableHealthRecord.$inferSelect;

export type ExerciseLogInsert = typeof tableExerciseLog.$inferInsert;
export type ExerciseLogUpdate = Partial<typeof tableExerciseLog.$inferSelect>;
export type ExerciseLog = typeof tableExerciseLog.$inferSelect;

export type FeedingScheduleInsert = typeof tableFeedingSchedule.$inferInsert;
export type FeedingScheduleUpdate = Partial<typeof tableFeedingSchedule.$inferSelect>;
export type FeedingSchedule = typeof tableFeedingSchedule.$inferSelect;

export type MaintenanceTaskInsert = typeof tableMaintenanceTask.$inferInsert;
export type MaintenanceTaskUpdate = Partial<typeof tableMaintenanceTask.$inferSelect>;
export type MaintenanceTask = typeof tableMaintenanceTask.$inferSelect;

export type MaintenanceRequestInsert = typeof tableMaintenanceRequest.$inferInsert;
export type MaintenanceRequestUpdate = Partial<typeof tableMaintenanceRequest.$inferSelect>;
export type MaintenanceRequest = typeof tableMaintenanceRequest.$inferSelect;

export type InvoiceInsert = typeof tableInvoice.$inferInsert;
export type InvoiceUpdate = Partial<typeof tableInvoice.$inferSelect>;
export type Invoice = typeof tableInvoice.$inferSelect;

export type PaymentInsert = typeof tablePayment.$inferInsert;
export type PaymentUpdate = Partial<typeof tablePayment.$inferSelect>;
export type Payment = typeof tablePayment.$inferSelect;

export type ExpenseInsert = typeof tableExpense.$inferInsert;
export type ExpenseUpdate = Partial<typeof tableExpense.$inferSelect>;
export type Expense = typeof tableExpense.$inferSelect;

export type IncomeInsert = typeof tableIncome.$inferInsert;
export type IncomeUpdate = Partial<typeof tableIncome.$inferSelect>;
export type Income = typeof tableIncome.$inferSelect;

export type InventoryItemInsert = typeof tableInventoryItem.$inferInsert;
export type InventoryItemUpdate = Partial<typeof tableInventoryItem.$inferSelect>;
export type InventoryItem = typeof tableInventoryItem.$inferSelect;

export type InventoryTransactionInsert = typeof tableInventoryTransaction.$inferInsert;
export type InventoryTransactionUpdate = Partial<typeof tableInventoryTransaction.$inferSelect>;
export type InventoryTransaction = typeof tableInventoryTransaction.$inferSelect;

export type PastureInsert = typeof tablePasture.$inferInsert;
export type PastureUpdate = Partial<typeof tablePasture.$inferSelect>;
export type Pasture = typeof tablePasture.$inferSelect;

export type PastureRotationInsert = typeof tablePastureRotation.$inferInsert;
export type PastureRotationUpdate = Partial<typeof tablePastureRotation.$inferSelect>;
export type PastureRotation = typeof tablePastureRotation.$inferSelect;

export type VisitorInsert = typeof tableVisitor.$inferInsert;
export type VisitorUpdate = Partial<typeof tableVisitor.$inferSelect>;
export type Visitor = typeof tableVisitor.$inferSelect;

export type VisitInsert = typeof tableVisit.$inferInsert;
export type VisitUpdate = Partial<typeof tableVisit.$inferSelect>;
export type Visit = typeof tableVisit.$inferSelect;

export type EventInsert = typeof tableEvent.$inferInsert;
export type EventUpdate = Partial<typeof tableEvent.$inferSelect>;
export type Event = typeof tableEvent.$inferSelect;

export type EventParticipantInsert = typeof tableEventParticipant.$inferInsert;
export type EventParticipantUpdate = Partial<typeof tableEventParticipant.$inferSelect>;
export type EventParticipant = typeof tableEventParticipant.$inferSelect;

export type FacilityInsert = typeof tableFacility.$inferInsert;
export type FacilityUpdate = Partial<typeof tableFacility.$inferSelect>;
export type Facility = typeof tableFacility.$inferSelect;

export type FacilityBookingInsert = typeof tableFacilityBooking.$inferInsert;
export type FacilityBookingUpdate = Partial<typeof tableFacilityBooking.$inferSelect>;
export type FacilityBooking = typeof tableFacilityBooking.$inferSelect;

export type BarnInsert = typeof tableBarn.$inferInsert;
export type BarnUpdate = Partial<typeof tableBarn.$inferSelect>;
export type Barn = typeof tableBarn.$inferSelect;

export type StallCustomizationInsert = typeof tableStallCustomization.$inferInsert;
export type StallCustomizationUpdate = Partial<typeof tableStallCustomization.$inferSelect>;
export type StallCustomization = typeof tableStallCustomization.$inferSelect;

export type StaffScheduleInsert = typeof tableStaffSchedule.$inferInsert;
export type StaffScheduleUpdate = Partial<typeof tableStaffSchedule.$inferSelect>;
export type StaffSchedule = typeof tableStaffSchedule.$inferSelect;

export type BudgetInsert = typeof tableBudget.$inferInsert;
export type BudgetUpdate = Partial<typeof tableBudget.$inferSelect>;
export type Budget = typeof tableBudget.$inferSelect;

export type BudgetCategoryInsert = typeof tableBudgetCategory.$inferInsert;
export type BudgetCategoryUpdate = Partial<typeof tableBudgetCategory.$inferSelect>;
export type BudgetCategory = typeof tableBudgetCategory.$inferSelect;

export type FinancialReportInsert = typeof tableFinancialReport.$inferInsert;
export type FinancialReportUpdate = Partial<typeof tableFinancialReport.$inferSelect>;
export type FinancialReport = typeof tableFinancialReport.$inferSelect;

export type CustomReportInsert = typeof tableCustomReport.$inferInsert;
export type CustomReportUpdate = Partial<typeof tableCustomReport.$inferSelect>;
export type CustomReport = typeof tableCustomReport.$inferSelect;

export type ScheduledReportInsert = typeof tableScheduledReport.$inferInsert;
export type ScheduledReportUpdate = Partial<typeof tableScheduledReport.$inferSelect>;
export type ScheduledReport = typeof tableScheduledReport.$inferSelect;

export type IncomeCategoryInsert = typeof tableIncomeCategory.$inferInsert;
export type IncomeCategoryUpdate = Partial<typeof tableIncomeCategory.$inferSelect>;
export type IncomeCategory = typeof tableIncomeCategory.$inferSelect;

export type ExpenseCategoryInsert = typeof tableExpenseCategory.$inferInsert;
export type ExpenseCategoryUpdate = Partial<typeof tableExpenseCategory.$inferSelect>;
export type ExpenseCategory = typeof tableExpenseCategory.$inferSelect;

export type VisitorDocumentInsert = typeof tableVisitorDocument.$inferInsert;
export type VisitorDocumentUpdate = Partial<typeof tableVisitorDocument.$inferSelect>;
export type VisitorDocument = typeof tableVisitorDocument.$inferSelect;

export type FeedTypeInsert = typeof tableFeedType.$inferInsert;
export type FeedTypeUpdate = Partial<typeof tableFeedType.$inferSelect>;
export type FeedType = typeof tableFeedType.$inferSelect;

export type PastureConditionLogInsert = typeof tablePastureConditionLog.$inferInsert;
export type PastureConditionLogUpdate = Partial<typeof tablePastureConditionLog.$inferSelect>;
export type PastureConditionLog = typeof tablePastureConditionLog.$inferSelect;

export type StallOccupancyInsert = typeof tableStallOccupancy.$inferInsert;
export type StallOccupancyUpdate = Partial<typeof tableStallOccupancy.$inferSelect>;
export type StallOccupancy = typeof tableStallOccupancy.$inferSelect;

export type TransactionInsert = typeof tableTransaction.$inferInsert;
export type TransactionUpdate = Partial<typeof tableTransaction.$inferSelect>;
export type Transaction = typeof tableTransaction.$inferSelect;

export type GoalsInsert = typeof tableGoals.$inferInsert;
export type GoalsUpdate = Partial<typeof tableGoals.$inferSelect>;
export type Goals = typeof tableGoals.$inferSelect;

export type ScheduledExerciseInsert = typeof tableScheduledExercise.$inferInsert;
export type ScheduledExerciseUpdate = Partial<typeof tableScheduledExercise.$inferSelect>;
export type ScheduledExercise = typeof tableScheduledExercise.$inferSelect;

export type FeedInventoryInsert = typeof tableFeedInventory.$inferInsert;
export type FeedInventoryUpdate = Partial<typeof tableFeedInventory.$inferSelect>;
export type FeedInventory = typeof tableFeedInventory.$inferSelect;

export type FeedingAlertInsert = typeof tableFeedingAlert.$inferInsert;
export type FeedingAlertUpdate = Partial<typeof tableFeedingAlert.$inferSelect>;
export type FeedingAlert = typeof tableFeedingAlert.$inferSelect;

export type ReportConfigurationInsert = typeof tableReportConfiguration.$inferInsert;
export type ReportConfigurationUpdate = Partial<typeof tableReportConfiguration.$inferSelect>;
export type ReportConfiguration = typeof tableReportConfiguration.$inferSelect;

export type ContractInsert = typeof tableContract.$inferInsert;
export type ContractUpdate = Partial<typeof tableContract.$inferSelect>;
export type Contract = typeof tableContract.$inferSelect;

export type ContractDocumentInsert = typeof tableContractDocument.$inferInsert;
export type ContractDocumentUpdate = Partial<typeof tableContractDocument.$inferSelect>;
export type ContractDocument = typeof tableContractDocument.$inferSelect;

export type ContractNoteInsert = typeof tableContractNote.$inferInsert;
export type ContractNoteUpdate = Partial<typeof tableContractNote.$inferSelect>;
export type ContractNote = typeof tableContractNote.$inferSelect;

export type BoardingContractInsert = typeof tableBoardingContract.$inferInsert;
export type BoardingContractUpdate = Partial<typeof tableBoardingContract.$inferSelect>;
export type BoardingContract = typeof tableBoardingContract.$inferSelect;

export type ContractHorseInsert = typeof tableContractHorse.$inferInsert;
export type ContractHorseUpdate = Partial<typeof tableContractHorse.$inferSelect>;
export type ContractHorse = typeof tableContractHorse.$inferSelect;

export type AnnouncementInsert = typeof tableAnnouncement.$inferInsert;
export type AnnouncementUpdate = Partial<typeof tableAnnouncement.$inferSelect>;
export type Announcement = typeof tableAnnouncement.$inferSelect;

export type AnnouncementViewInsert = typeof tableAnnouncementView.$inferInsert;
export type AnnouncementViewUpdate = Partial<typeof tableAnnouncementView.$inferSelect>;
export type AnnouncementView = typeof tableAnnouncementView.$inferSelect;

export type AnnouncementResponseInsert = typeof tableAnnouncementResponse.$inferInsert;
export type AnnouncementResponseUpdate = Partial<typeof tableAnnouncementResponse.$inferSelect>;
export type AnnouncementResponse = typeof tableAnnouncementResponse.$inferSelect;

export type ConversationInsert = typeof tableConversation.$inferInsert;
export type ConversationUpdate = Partial<typeof tableConversation.$inferSelect>;
export type Conversation = typeof tableConversation.$inferSelect;

export type MessageInsert = typeof tableMessage.$inferInsert;
export type MessageUpdate = Partial<typeof tableMessage.$inferSelect>;
export type Message = typeof tableMessage.$inferSelect;

export type ConversationParticipantInsert = typeof tableConversationParticipant.$inferInsert;
export type ConversationParticipantUpdate = Partial<typeof tableConversationParticipant.$inferSelect>;
export type ConversationParticipant = typeof tableConversationParticipant.$inferSelect;

export type MessageAttachmentInsert = typeof tableMessageAttachment.$inferInsert;
export type MessageAttachmentUpdate = Partial<typeof tableMessageAttachment.$inferSelect>;
export type MessageAttachment = typeof tableMessageAttachment.$inferSelect;

export type BoarderDocumentInsert = typeof tableBoarderDocument.$inferInsert;
export type BoarderDocumentUpdate = Partial<typeof tableBoarderDocument.$inferSelect>;
export type BoarderDocument = typeof tableBoarderDocument.$inferSelect;

export type BoarderChangeLogInsert = typeof tableBoarderChangeLog.$inferInsert;
export type BoarderChangeLogUpdate = Partial<typeof tableBoarderChangeLog.$inferSelect>;
export type BoarderChangeLog = typeof tableBoarderChangeLog.$inferSelect;

export type StaffInsert = typeof tableStaff.$inferInsert;
export type StaffUpdate = Partial<typeof tableStaff.$inferSelect>;
export type Staff = typeof tableStaff.$inferSelect;

export type ShiftInsert = typeof tableShift.$inferInsert;
export type ShiftUpdate = Partial<typeof tableShift.$inferSelect>;
export type Shift = typeof tableShift.$inferSelect;

export type NotificationInsert = typeof tableNotification.$inferInsert;
export type NotificationUpdate = Partial<typeof tableNotification.$inferSelect>;
export type Notification = typeof tableNotification.$inferSelect;

export type SearchIndexInsert = typeof tableSearchIndex.$inferInsert;
export type SearchIndexUpdate = Partial<typeof tableSearchIndex.$inferSelect>;
export type SearchIndex = typeof tableSearchIndex.$inferSelect;

export type RelatedItemInsert = typeof tableRelatedItem.$inferInsert;
export type RelatedItemUpdate = Partial<typeof tableRelatedItem.$inferSelect>;
export type RelatedItem = typeof tableRelatedItem.$inferSelect;

export type TrainerInsert = typeof tableTrainer.$inferInsert;
export type TrainerUpdate = Partial<typeof tableTrainer.$inferSelect>;
export type Trainer = typeof tableTrainer.$inferSelect;

export type ExerciseTypeInsert = typeof tableExerciseType.$inferInsert;
export type ExerciseTypeUpdate = Partial<typeof tableExerciseType.$inferSelect>;
export type ExerciseType = typeof tableExerciseType.$inferSelect;

export type InventoryCategoryInsert = typeof tableInventoryCategory.$inferInsert;
export type InventoryCategoryUpdate = Partial<typeof tableInventoryCategory.$inferSelect>;
export type InventoryCategory = typeof tableInventoryCategory.$inferSelect;

export type InventoryItemCategoryChangeInsert = typeof tableInventoryItemCategoryChange.$inferInsert;
export type InventoryItemCategoryChangeUpdate = Partial<typeof tableInventoryItemCategoryChange.$inferSelect>;
export type InventoryItemCategoryChange = typeof tableInventoryItemCategoryChange.$inferSelect;

export type SupplierInsert = typeof tableSupplier.$inferInsert;
export type SupplierUpdate = Partial<typeof tableSupplier.$inferSelect>;
export type Supplier = typeof tableSupplier.$inferSelect;

export type SupplierOrderInsert = typeof tableSupplierOrder.$inferInsert;
export type SupplierOrderUpdate = Partial<typeof tableSupplierOrder.$inferSelect>;
export type SupplierOrder = typeof tableSupplierOrder.$inferSelect;

export type TimeOffRequestInsert = typeof tableTimeOffRequest.$inferInsert;
export type TimeOffRequestUpdate = Partial<typeof tableTimeOffRequest.$inferSelect>;
export type TimeOffRequest = typeof tableTimeOffRequest.$inferSelect;

export type ShiftChangeRequestInsert = typeof tableShiftChangeRequest.$inferInsert;
export type ShiftChangeRequestUpdate = Partial<typeof tableShiftChangeRequest.$inferSelect>;
export type ShiftChangeRequest = typeof tableShiftChangeRequest.$inferSelect;

export type ScheduleInsert = typeof tableSchedule.$inferInsert;
export type ScheduleUpdate = Partial<typeof tableSchedule.$inferSelect>;
export type Schedule = typeof tableSchedule.$inferSelect;

export type ScheduleChangeLogInsert = typeof tableScheduleChangeLog.$inferInsert;
export type ScheduleChangeLogUpdate = Partial<typeof tableScheduleChangeLog.$inferSelect>;
export type ScheduleChangeLog = typeof tableScheduleChangeLog.$inferSelect;

export type ScheduleTemplateInsert = typeof tableScheduleTemplate.$inferInsert;
export type ScheduleTemplateUpdate = Partial<typeof tableScheduleTemplate.$inferSelect>;
export type ScheduleTemplate = typeof tableScheduleTemplate.$inferSelect;

export type StallActivityInsert = typeof tableStallActivity.$inferInsert;
export type StallActivityUpdate = Partial<typeof tableStallActivity.$inferSelect>;
export type StallActivity = typeof tableStallActivity.$inferSelect;

export type BarnLayoutInsert = typeof tableBarnLayout.$inferInsert;
export type BarnLayoutUpdate = Partial<typeof tableBarnLayout.$inferSelect>;
export type BarnLayout = typeof tableBarnLayout.$inferSelect;

export type StallReportInsert = typeof tableStallReport.$inferInsert;
export type StallReportUpdate = Partial<typeof tableStallReport.$inferSelect>;
export type StallReport = typeof tableStallReport.$inferSelect;

export type StallAssignmentInsert = typeof tableStallAssignment.$inferInsert;
export type StallAssignmentUpdate = Partial<typeof tableStallAssignment.$inferSelect>;
export type StallAssignment = typeof tableStallAssignment.$inferSelect;

export type FacilityPhotoInsert = typeof tableFacilityPhoto.$inferInsert;
export type FacilityPhotoUpdate = Partial<typeof tableFacilityPhoto.$inferSelect>;
export type FacilityPhoto = typeof tableFacilityPhoto.$inferSelect;

export type FacilityChangeLogInsert = typeof tableFacilityChangeLog.$inferInsert;
export type FacilityChangeLogUpdate = Partial<typeof tableFacilityChangeLog.$inferSelect>;
export type FacilityChangeLog = typeof tableFacilityChangeLog.$inferSelect;

export type FacilityAvailabilityInsert = typeof tableFacilityAvailability.$inferInsert;
export type FacilityAvailabilityUpdate = Partial<typeof tableFacilityAvailability.$inferSelect>;
export type FacilityAvailability = typeof tableFacilityAvailability.$inferSelect;

export type FeedingChangeLogInsert = typeof tableFeedingChangeLog.$inferInsert;
export type FeedingChangeLogUpdate = Partial<typeof tableFeedingChangeLog.$inferSelect>;
export type FeedingChangeLog = typeof tableFeedingChangeLog.$inferSelect;

export type FeedingHistoryInsert = typeof tableFeedingHistory.$inferInsert;
export type FeedingHistoryUpdate = Partial<typeof tableFeedingHistory.$inferSelect>;
export type FeedingHistory = typeof tableFeedingHistory.$inferSelect;

export type HealthReminderInsert = typeof tableHealthReminder.$inferInsert;
export type HealthReminderUpdate = Partial<typeof tableHealthReminder.$inferSelect>;
export type HealthReminder = typeof tableHealthReminder.$inferSelect;

export type VetNoteInsert = typeof tableVetNote.$inferInsert;
export type VetNoteUpdate = Partial<typeof tableVetNote.$inferSelect>;
export type VetNote = typeof tableVetNote.$inferSelect;

export type ExerciseStatsInsert = typeof tableExerciseStats.$inferInsert;
export type ExerciseStatsUpdate = Partial<typeof tableExerciseStats.$inferSelect>;
export type ExerciseStats = typeof tableExerciseStats.$inferSelect;

export type ExerciseReportInsert = typeof tableExerciseReport.$inferInsert;
export type ExerciseReportUpdate = Partial<typeof tableExerciseReport.$inferSelect>;
export type ExerciseReport = typeof tableExerciseReport.$inferSelect;

export type AutomatedReportInsert = typeof tableAutomatedReport.$inferInsert;
export type AutomatedReportUpdate = Partial<typeof tableAutomatedReport.$inferSelect>;
export type AutomatedReport = typeof tableAutomatedReport.$inferSelect;

export type ExerciseGoalInsert = typeof tableExerciseGoal.$inferInsert;
export type ExerciseGoalUpdate = Partial<typeof tableExerciseGoal.$inferSelect>;
export type ExerciseGoal = typeof tableExerciseGoal.$inferSelect;

export type PastureMaintenanceInsert = typeof tablePastureMaintenance.$inferInsert;
export type PastureMaintenanceUpdate = Partial<typeof tablePastureMaintenance.$inferSelect>;
export type PastureMaintenance = typeof tablePastureMaintenance.$inferSelect;

export type PastureRotationPlanInsert = typeof tablePastureRotationPlan.$inferInsert;
export type PastureRotationPlanUpdate = Partial<typeof tablePastureRotationPlan.$inferSelect>;
export type PastureRotationPlan = typeof tablePastureRotationPlan.$inferSelect;

export type PastureRotationPlanDetailInsert = typeof tablePastureRotationPlanDetail.$inferInsert;
export type PastureRotationPlanDetailUpdate = Partial<typeof tablePastureRotationPlanDetail.$inferSelect>;
export type PastureRotationPlanDetail = typeof tablePastureRotationPlanDetail.$inferSelect;

export type PastureActionLogInsert = typeof tablePastureActionLog.$inferInsert;
export type PastureActionLogUpdate = Partial<typeof tablePastureActionLog.$inferSelect>;
export type PastureActionLog = typeof tablePastureActionLog.$inferSelect;

export type BudgetAlertInsert = typeof tableBudgetAlert.$inferInsert;
export type BudgetAlertUpdate = Partial<typeof tableBudgetAlert.$inferSelect>;
export type BudgetAlert = typeof tableBudgetAlert.$inferSelect;

export type BudgetAdjustmentInsert = typeof tableBudgetAdjustment.$inferInsert;
export type BudgetAdjustmentUpdate = Partial<typeof tableBudgetAdjustment.$inferSelect>;
export type BudgetAdjustment = typeof tableBudgetAdjustment.$inferSelect;

export type BudgetComparisonInsert = typeof tableBudgetComparison.$inferInsert;
export type BudgetComparisonUpdate = Partial<typeof tableBudgetComparison.$inferSelect>;
export type BudgetComparison = typeof tableBudgetComparison.$inferSelect;

export type BudgetVersionInsert = typeof tableBudgetVersion.$inferInsert;
export type BudgetVersionUpdate = Partial<typeof tableBudgetVersion.$inferSelect>;
export type BudgetVersion = typeof tableBudgetVersion.$inferSelect;

export type BudgetExportInsert = typeof tableBudgetExport.$inferInsert;
export type BudgetExportUpdate = Partial<typeof tableBudgetExport.$inferSelect>;
export type BudgetExport = typeof tableBudgetExport.$inferSelect;

export type BillingConfigurationInsert = typeof tableBillingConfiguration.$inferInsert;
export type BillingConfigurationUpdate = Partial<typeof tableBillingConfiguration.$inferSelect>;
export type BillingConfiguration = typeof tableBillingConfiguration.$inferSelect;

export type ContractHistoryInsert = typeof tableContractHistory.$inferInsert;
export type ContractHistoryUpdate = Partial<typeof tableContractHistory.$inferSelect>;
export type ContractHistory = typeof tableContractHistory.$inferSelect;

export type ContractActionInsert = typeof tableContractAction.$inferInsert;
export type ContractActionUpdate = Partial<typeof tableContractAction.$inferSelect>;
export type ContractAction = typeof tableContractAction.$inferSelect;

export type ContractTemplateInsert = typeof tableContractTemplate.$inferInsert;
export type ContractTemplateUpdate = Partial<typeof tableContractTemplate.$inferSelect>;
export type ContractTemplate = typeof tableContractTemplate.$inferSelect;

export type ContractVersionInsert = typeof tableContractVersion.$inferInsert;
export type ContractVersionUpdate = Partial<typeof tableContractVersion.$inferSelect>;
export type ContractVersion = typeof tableContractVersion.$inferSelect;

export type CustomTransactionCategoryInsert = typeof tableCustomTransactionCategory.$inferInsert;
export type CustomTransactionCategoryUpdate = Partial<typeof tableCustomTransactionCategory.$inferSelect>;
export type CustomTransactionCategory = typeof tableCustomTransactionCategory.$inferSelect;

export type BatchOperationInsert = typeof tableBatchOperation.$inferInsert;
export type BatchOperationUpdate = Partial<typeof tableBatchOperation.$inferSelect>;
export type BatchOperation = typeof tableBatchOperation.$inferSelect;

export type ExportHistoryInsert = typeof tableExportHistory.$inferInsert;
export type ExportHistoryUpdate = Partial<typeof tableExportHistory.$inferSelect>;
export type ExportHistory = typeof tableExportHistory.$inferSelect;

export type SavedReportInsert = typeof tableSavedReport.$inferInsert;
export type SavedReportUpdate = Partial<typeof tableSavedReport.$inferSelect>;
export type SavedReport = typeof tableSavedReport.$inferSelect;

export type ReportTemplateInsert = typeof tableReportTemplate.$inferInsert;
export type ReportTemplateUpdate = Partial<typeof tableReportTemplate.$inferSelect>;
export type ReportTemplate = typeof tableReportTemplate.$inferSelect;

export type ReportExportInsert = typeof tableReportExport.$inferInsert;
export type ReportExportUpdate = Partial<typeof tableReportExport.$inferSelect>;
export type ReportExport = typeof tableReportExport.$inferSelect;

export type MaintenanceCategoryInsert = typeof tableMaintenanceCategory.$inferInsert;
export type MaintenanceCategoryUpdate = Partial<typeof tableMaintenanceCategory.$inferSelect>;
export type MaintenanceCategory = typeof tableMaintenanceCategory.$inferSelect;

export type ReorderHistoryInsert = typeof tableReorderHistory.$inferInsert;
export type ReorderHistoryUpdate = Partial<typeof tableReorderHistory.$inferSelect>;
export type ReorderHistory = typeof tableReorderHistory.$inferSelect;

export type InventoryMaintenanceRequestInsert = typeof tableInventoryMaintenanceRequest.$inferInsert;
export type InventoryMaintenanceRequestUpdate = Partial<typeof tableInventoryMaintenanceRequest.$inferSelect>;
export type InventoryMaintenanceRequest = typeof tableInventoryMaintenanceRequest.$inferSelect;

export type StaffRoleInsert = typeof tableStaffRole.$inferInsert;
export type StaffRoleUpdate = Partial<typeof tableStaffRole.$inferSelect>;
export type StaffRole = typeof tableStaffRole.$inferSelect;

export type ScheduledVisitInsert = typeof tableScheduledVisit.$inferInsert;
export type ScheduledVisitUpdate = Partial<typeof tableScheduledVisit.$inferSelect>;
export type ScheduledVisit = typeof tableScheduledVisit.$inferSelect;

export type VisitorTypeInsert = typeof tableVisitorType.$inferInsert;
export type VisitorTypeUpdate = Partial<typeof tableVisitorType.$inferSelect>;
export type VisitorType = typeof tableVisitorType.$inferSelect;

export type MaintenanceReportInsert = typeof tableMaintenanceReport.$inferInsert;
export type MaintenanceReportUpdate = Partial<typeof tableMaintenanceReport.$inferSelect>;
export type MaintenanceReport = typeof tableMaintenanceReport.$inferSelect;
  