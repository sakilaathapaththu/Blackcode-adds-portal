import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password required"),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(8, "Password must be 8+ characters")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[0-9]/, "At least one number")
    .matches(/[@$!%*?&#]/, "At least one special character")
    .required("Password required"),
});
