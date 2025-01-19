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
  userId: number;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date | null;

  @IsOptional()
  @IsDateString()
  endDate?: Date | null;

  @IsEnum(["cash", "stripe", "paypal"])
  paymentMethod!: "cash" | "stripe" | "paypal";

  constructor(
    userId: number,
    plan: string,
    startDate: Date | null,
    endDate: Date | null,
    paymentMethod: "cash" | "stripe" | "paypal"
  ) {
    this.userId = userId;
    this.plan = plan;
    this.startDate = startDate;
    this.endDate = endDate;
    this.paymentMethod = paymentMethod;
  }
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
