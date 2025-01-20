import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNotEmpty,
} from "class-validator";

// Enums for better type safety
export enum PaymentMethod {
  CASH = "cash",
  STRIPE = "stripe",
  PAYPAL = "paypal",
}
export enum StatutJuridique {
  ENTREPRISE = "entreprise",
  PARTICULIER = "particulier",
}
export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  CANCELLED = "cancelled",
}

// DTO for creating a subscription
export class CreateSubscriptionDTO {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  planId: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date | null;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  statutJuridique!: StatutJuridique;

  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @IsString()
  @IsNotEmpty()
  rue!: string;

  @IsInt()
  @IsNotEmpty()
  codePostal!: number;

  @IsString()
  @IsNotEmpty()
  ville!: string;

  constructor(
    userId: number,
    planId: number,
    startDate: Date | null,
    endDate: Date | null,
    paymentMethod: PaymentMethod,
    statutJuridique: StatutJuridique,
    firstname: string,
    lastname: string,
    rue: string,
    codePostal: number,
    ville: string
  ) {
    this.userId = userId;
    this.planId = planId;
    this.startDate = startDate;
    this.paymentMethod = paymentMethod;
    this.statutJuridique = statutJuridique;
    this.firstname = firstname;
    this.lastname = lastname;
    this.rue = rue;
    this.codePostal = codePostal;
    this.ville = ville;
  }
}

// DTO for updating a subscription
export class UpdateSubscriptionDTO {
  @IsOptional()
  @IsInt()
  planId?: number;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsDateString()
  endDate?: Date | null;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  constructor(
    planId?: number,
    status?: SubscriptionStatus,
    endDate?: Date | null,
    paymentMethod?: PaymentMethod
  ) {
    this.planId = planId;
    this.status = status;
    this.endDate = endDate;
    this.paymentMethod = paymentMethod;
  }
}
