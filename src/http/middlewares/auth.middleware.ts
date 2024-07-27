import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "http-errors-enhanced";

/**
 * Use this decorator to protect a route.
 *
 * @example
 * ```typescript
 * POST({ url: "/example" })
 * JwtGuard()
 * async example(request) {}
 * ```
 */
export function JwtGuard(): MethodDecorator {
	return (
		target,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: FastifyRequest[]) {
			const request: FastifyRequest = args[0];

			const allowGuest = Reflect.getMetadata("Guest", target, propertyKey);

      if (!allowGuest) {
        try {
          await request.jwtVerify();
        } catch (err) {
          throw new UnauthorizedError("Unauthorized");
        }
      }

      return originalMethod.apply(this, args);
    };

		return descriptor;
	};
}

function UseGuard(decorator: MethodDecorator) {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	return (target: Function) => {
		for (const key of Object.getOwnPropertyNames(target.prototype)) {
			if (key === "constructor") {
				continue;
			}
			const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
			if (descriptor) {
				decorator(target.prototype, key, descriptor);
				Object.defineProperty(target.prototype, key, descriptor);
			}
		}
	};
}
/**
 * Use this decorator to protect all routes in a rest controller.
 *
 * @example
 * ```typescript
 * Controller({ route: "/example" })
 * AuthGuard()
 * export default class ExampleController {}
 * ```
 */
export function AuthGuard() {
	return UseGuard(JwtGuard());
}

/**
 * Use this decorator to allow guest access to a route.
 *
 * @example
 * ```typescript
	 * POST({ url: "/auth" })
	 * Guest()
	 * async auth(request) {}
 * ```
 */
export function Guest(): MethodDecorator {
	return (target, propertyKey, descriptor) => {
		Reflect.defineMetadata("Guest", true, target, propertyKey);
		return descriptor;
	};
}