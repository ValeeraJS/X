/* eslint-disable max-nested-callbacks */
import { Component, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("world has entity", function () {
    const world = new World();
    const e1 = new Entity();
	it('entity add to world', function () {
		expect(world.hasEntity(e1)).to.equal(false);
        e1.addTo(world);
		expect(world.hasEntity(e1)).to.equal(true);
        world.clearAllEntities();
        e1.addTo(world.entityManager);
		expect(world.hasEntity(e1)).to.equal(true);
	});
});

describe("entity has component", function () {
    const e1 = new Entity();
    const c = new Component(0, [], "Component");
	it('entity has component', function () {
		expect(e1.hasComponent(c)).to.equal(false);
        e1.add(c);
		expect(e1.hasComponent(c)).to.equal(true);
		expect(e1.hasComponent(Component)).to.equal(true);
		expect(e1.hasComponent("Component")).to.equal(true);
		expect(e1.hasComponent(c.id)).to.equal(true);

		expect(e1.getComponent(Component)).to.equal(c);
		expect(e1.getComponent("Component")).to.equal(c);
		expect(e1.getComponent(c.id)).to.equal(c);
		expect(e1.getComponent("a")).to.equal(null);

        e1.remove(c);
		expect(e1.hasComponent(c)).to.equal(false);

        e1.add(c);
        e1.componentManager.remove(Component);
		expect(e1.hasComponent(c)).to.equal(false);
	});
});

describe("entity clone", function () {
    const e1 = new Entity();
    const c = new Component(0, []);
	it('entity add to world', function () {
        e1.add(c);
		const e2 = e1.clone();
        expect(e2.hasComponent(c)).to.equal(true);
        const e3 = e1.clone(true);
        expect(e3.hasComponent(c)).to.equal(false);
        expect(e3.hasComponent(c.name)).to.equal(true);

        const ee = new Entity();
        const ee1 = new Entity();
        ee.addChild(ee1);
        const d = ee.clone(true, true);
        expect(!!d.children[0]).to.equal(true);
        expect(d.children[0] === ee1).to.equal(false);
	});
});

describe("entity destroy", function () {
    const e1 = new Entity();
    const c = new Component(0, []);
    const world = new World();
	it('entity destroy', function () {
        world.add(e1);
        e1.addComponent(c);
		e1.destroy();
        expect(e1.hasComponent(c)).to.equal(false);
        expect(world.hasEntity(e1)).to.equal(false);
	});
});

describe("entity get components", function () {
    const e1 = new Entity();
    const c = new Component(0, [{label: 'aaa', unique: false}]);
    const c2 = new Component(0, [{label: 'aaa', unique: false}]);
    class CC extends Component<number> {}
	it('entity get component by label', function () {
        e1.add(c);
        expect(e1.getComponentByTagLabel('aaa')).to.equal(c);
        expect(e1.getComponentByTagLabel('aaaaaa')).to.equal(null);
	});
    it('entity get components by label', function () {
        expect(e1.getComponentsByTagLabel('aaa')[0]).to.equal(c);
        expect(e1.getComponentsByTagLabel('aaaaa').length).to.equal(0);
	});
    it('entity get components by class', function () {
        e1.add(c2);
        expect(e1.getComponentsByClass(Component)[1]).to.equal(c2);
        expect(e1.getComponentsByClass(CC).length).to.equal(0);
	});
});

describe("entity serialize", function () {
    const e1 = new Entity();
    const c = new Component(0, []);
	it('serialize', function () {
        e1.addComponent(c);
		const json = e1.serialize();
        expect(json.id).to.equal(e1.id);
        expect(json.components[0]).to.equal(c.id);
	});
});
