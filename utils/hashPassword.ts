import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  if(!password) return "";
  const salt = await bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
