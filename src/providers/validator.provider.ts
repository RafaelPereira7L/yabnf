// import { type UserDTO, UserValidator } from "@entities/user.entity";
// import { validate, type ValidationError } from "class-validator";
// import { BadRequestError } from "http-errors-enhanced";

// export async function validateDTO(dto: UserDTO, ): Promise<ValidationError[]> {
// 	const validationInstance = new UserValidator(dto);
// 	const errors = await validate(validationInstance);

//   console.log(validationInstance);

//   if (errors.length > 0) {
//     throw new BadRequestError(errors);
//   }
// 	return errors;
// }
