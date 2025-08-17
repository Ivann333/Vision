import { BadRequestException } from '@nestjs/common';

export function ensureEndTimeAfterStartTime(
  startTime: string | Date,
  endTime: string | Date,
) {
  const endTimeDate = new Date(endTime);
  const startTimeDate = new Date(startTime);

  if (endTimeDate <= startTimeDate)
    throw new BadRequestException('endTime must be after startTime');
}
