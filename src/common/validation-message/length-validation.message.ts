import { ValidationArguments } from 'class-validator';

export const LengthValidationMessage = (args: ValidationArguments) => {
  // 1. value
  // 2. args.constrants[0] -> here it is 2
  //    args.constrants[1] -> here it is 20
  // 3. targetName -> className
  // 4. object -> verifying Object
  // 5. property name -> her it is nickname;
  if (args.constraints.length === 2) {
    return `${args.property} requires ${args.constraints[0]} ~ ${args.constraints[1]} characters`;
  } else {
    return `${args.property} requires at least ${args.constraints[0]} characters`;
  }
};
