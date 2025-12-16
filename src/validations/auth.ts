import { z } from "zod";


export const createEmailSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("invalidEmail") })
      .email({ message: t("invalidEmail") }),
  });


export const createDetailsSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(2, { message: t("firstName") }),
    lastName: z.string().min(2, { message: t("lastName") }),
    phone: z.string().min(5, { message: t("phone") }),
  });

export const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(2, { message: t("firstName") }),
    lastName: z.string().min(2, { message: t("lastName") }),
    email: z
      .string()
      .min(1, { message: t("invalidEmail") })
      .email({ message: t("invalidEmail") }),
    phone: z.string().min(5, { message: t("phone") }),
    sex: z.enum(["male", "female"], { message: t("invalidSex") }),
    birthday: z.date({ message: t("invalidBirthday") }), 
  });


export type EmailSchema = z.infer<ReturnType<typeof createEmailSchema>>;
export type DetailsSchema = z.infer<ReturnType<typeof createDetailsSchema>>;
export type ProfileSchema = z.infer<ReturnType<typeof createProfileSchema>>;