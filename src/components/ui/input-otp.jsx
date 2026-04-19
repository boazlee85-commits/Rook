import { InputOTP } from "input-otp";
import { cn } from "@/lib/utils";

const OtpInput = ({ className, ...props }) => (
  <InputOTP className={cn("flex gap-2", className)} {...props} />
);

export { OtpInput as InputOTP };
