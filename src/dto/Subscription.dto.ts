import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsIn,
} from "class-validator";

export class CreateSubscriptionDTO {
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  plan!: string;

  @IsDateString()
  startDate!: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date | null;

  @IsEnum(["cash", "stripe", "paypal"])
  paymentMethod!: "cash" | "stripe" | "paypal";
}

export class UpdateSubscriptionDTO {
  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsIn(["active", "inactive", "cancelled"])
  status?: "active" | "inactive" | "cancelled";

  @IsOptional()
  @IsDateString()
  endDate?: Date | null;

  @IsOptional()
  @IsEnum(["cash", "stripe", "paypal"])
  paymentMethod?: "cash" | "stripe" | "paypal";
}
