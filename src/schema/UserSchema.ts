import { z } from "zod";
import { errorUtil } from "zod/lib/helpers/errorUtil";

const alphanumerical: RegExp = /^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
const regExpError: errorUtil.ErrMessage = "Only alphanumerical characters allowed"

export const LoginSchema = z.object({

  username: z
  .string()
  .max(15)
  .min(4)
  .regex(alphanumerical, regExpError),
  password: z
  .string()
  .max(30)
  .min(5),

})

export const SignUpSchema = z.object({

    username: z
    .string()
    .max(15)
    .min(4)
    .regex(alphanumerical, regExpError),
    password: z
    .string()
    .max(30)
    .min(5),
    name: z
    .string()
    .max(15)
    .min(3)
    .regex(alphanumerical, regExpError),
    email: z
    .string()
    .max(50)
    .email()

})