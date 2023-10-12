import validator from 'validator';

export function isEmailValid(email: string): boolean {
  return validator.isEmail(email);
}

export function isMobileNumberValid(mobileNumber: string): boolean {
  return (
    validator.isMobilePhone(mobileNumber, 'en-IN') &&
    validator.isLength(mobileNumber, { min: 10, max: 10 })
  );
}

export function isValidUUID(uuid: string): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}
