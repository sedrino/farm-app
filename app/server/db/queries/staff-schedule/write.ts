import { db } from "@/server/db/connection";
import { StaffScheduleInsert, tableStaffSchedule } from "@/server/db/schema";

export async function addStaffSchedule({
  staffId,
  shifts,
}: {
  staffId: string;
  shifts: {
    date: string;
    startTime: string;
    endTime: string;
    task: string;
  }[];
}): Promise<StaffScheduleInsert[]> {
  const staffSchedules: StaffScheduleInsert[] = shifts.map((shift) => ({
    userId: staffId,
    shiftStart: new Date(shift.date + " " + shift.startTime).getTime(),
    shiftEnd: new Date(shift.date + " " + shift.endTime).getTime(),
    role: shift.task,
    assignedArea: "", // Assuming there's no specific area assigned
    colorCode: "", // Assuming there's no specific color code
    notes: "", // Assuming no additional notes
    weekNumber: 0, // Assuming week number is not calculated
    month: 0, // Assuming month is not calculated
    isRecurring: false, // Assuming shifts are not recurring
  }));

  // Insert the staff schedules into the database
  const result = await db
    .insert(tableStaffSchedule)
    .values(staffSchedules)
    .returning();

  return result;
}
