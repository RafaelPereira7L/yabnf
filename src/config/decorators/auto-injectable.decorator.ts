import { container, injectable } from "tsyringe";

export function AutoInjectable() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return <T>(target: new (...args: any[]) => T): void => {
		if(container.isRegistered(target.name)) {
			return;
		}
		injectable()(target);
		container.register(target.name, { useClass: target });
	};
}
