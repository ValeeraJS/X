export const CommonECSObjectEvents = {
	ADDED: "added",
	REMOVED: "removed",
	UPDATED: "updated",
	CREATED: "created",
	BEFORE_DESTROY: "before-destroy",
};

export const EntityEvents = {
	ADD_CHILD: "add-child",
	ADD_COMPONENT: "add-component",
	REMOVE_CHILD: "remove-child",
	REMOVE_COMPONENT: "remove-component",
};

export const WorldEvents = {
	ADD_ENTITY: "add-child",
	ADD_SYSTEM: "add-system",
	REMOVE_COMPONENT: "remove-child",
	REMOVE_CHILD: "remove-system",
};

export const SystemEvents = {
	PAUSED: "paused",
	RESUMED: "resumed",
};
