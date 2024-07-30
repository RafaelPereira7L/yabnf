import { BadRequestError } from "http-errors-enhanced";
import type { ZodSchema } from "zod";

export function Validate(schema: ZodSchema) {
	return (_target, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args) {
			const data = args[0];

			const result = schema.safeParse(data);

			if (!result.success) {
        const errors = result.error.flatten().fieldErrors;

				throw new BadRequestError('Failed to validate request body', {
          failedValidations: errors
        });

			}

			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}
