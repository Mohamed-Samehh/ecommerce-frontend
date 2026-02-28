import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const notFutureDateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const inputDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(inputDate.getTime())) {
    return { invalidDate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate > today ? { futureDate: true } : null;
};
