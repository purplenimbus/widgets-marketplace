import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
  if(!password) return "";
  const salt = await bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export default hashPassword;
