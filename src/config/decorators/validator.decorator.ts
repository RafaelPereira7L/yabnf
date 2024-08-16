import { BadRequestError } from "http-errors-enhanced";
import type { ZodSchema } from "zod";

export function Validate(schema: ZodSchema) {
	return (_target, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args) {
			let data: object;

			if(args.length === 0) {
				throw new BadRequestError('Request body is required');
			}

			if(typeof args[0] !== 'object') {
				data = args[1] 

				if(Object.keys(data).length === 0) {
					throw new BadRequestError('Request body is required');
				}

			} else {
				data = args[0]

				if(Object.keys(data).length === 0) {
					throw new BadRequestError('Request body is required');
				}
			}

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
