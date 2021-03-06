(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined"
		? (module.exports = factory())
		: typeof define === "function" && define.amd
		? define(factory)
			: ((global = typeof globalThis !== "undefined" ? globalThis : global || self),
		  (global.EventDispatcher = factory()));
})(this, function() {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	const mixin = (Base = Object, eventKeyList = []) => {
		let _a;

		return (
			(_a = class EventDispatcher extends Base {
				constructor() {
					super(...arguments);
					// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
					this.eventKeyList = eventKeyList;
					/**
					 * store all the filters
					 */
					// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
					this.filters = [];
					/**
					 * store all the listeners by key
					 */
					// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
					this.listeners = new Map();
					this.all = (listener) => {
						return this.filt(() => true, listener);
					};
					this.clearListenersByKey = (eventKey) => {
						this.listeners.delete(eventKey);

						return this;
					};
					this.clearAllListeners = () => {
						const keys = this.listeners.keys();

						for (const key of keys) {
							this.listeners.delete(key);
						}

						return this;
					};
					this.filt = (rule, listener) => {
						this.filters.push({
							listener,
							rule
						});

						return this;
					};
					this.fire = (eventKey, target) => {
						if (!this.checkEventKeyAvailable(eventKey)) {
							console.error(
								"EventDispatcher couldn't dispatch the event since EventKeyList doesn't contains key: ",
								eventKey
							);

							return this;
						}
						const array = this.listeners.get(eventKey) || [];
						let len = array.length;
						let item;

						for (let i = 0; i < len; i++) {
							item = array[i];
							item.listener({
								eventKey,
								life: --item.times,
								target
							});
							if (item.times <= 0) {
								array.splice(i--, 1);
								--len;
							}
						}

						return this.checkFilt(eventKey, target);
					};
					this.off = (eventKey, listener) => {
						const array = this.listeners.get(eventKey);

						if (!array) {
							return this;
						}
						const len = array.length;

						for (let i = 0; i < len; i++) {
							if (array[i].listener === listener) {
								array.splice(i, 1);
								break;
							}
						}

						return this;
					};
					this.on = (eventKey, listener) => {
						return this.times(eventKey, Infinity, listener);
					};
					this.once = (eventKey, listener) => {
						return this.times(eventKey, 1, listener);
					};
					this.times = (eventKey, times, listener) => {
						if (!this.checkEventKeyAvailable(eventKey)) {
							console.error(
								"EventDispatcher couldn't add the listener: ",
								listener,
								"since EventKeyList doesn't contains key: ",
								eventKey
							);

							return this;
						}
						const array = this.listeners.get(eventKey) || [];

						if (!this.listeners.has(eventKey)) {
							this.listeners.set(eventKey, array);
						}
						array.push({
							listener,
							times
						});

						return this;
					};
					this.checkFilt = (eventKey, target) => {
						for (const item of this.filters) {
							if (item.rule(eventKey, target)) {
								item.listener({
									eventKey,
									life: Infinity,
									target
								});
							}
						}

						return this;
					};
					this.checkEventKeyAvailable = (eventKey) => {
						if (this.eventKeyList.length) {
							return this.eventKeyList.includes(eventKey);
						}

						return true;
					};
				}
			}),
			(_a.mixin = mixin),
			_a
		);
	};
	const EventDispatcher = mixin(Object);

	return EventDispatcher;
});
// # sourceMappingURL=EventDispatcher.js.map
