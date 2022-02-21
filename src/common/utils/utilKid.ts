//散列加密出密码
export function encryption(password: string): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs');
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
//比较密码是否是正确的密码
export async function validatePassword(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bcrypt = require('bcryptjs');
  console.log({ password, hashPassword });
  return await bcrypt.compare(password, hashPassword);
}
