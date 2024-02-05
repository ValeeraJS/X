/* eslint-disable max-nested-callbacks */
import { System, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("world has entity", function () {
    const world = new World();
    const e1 = new Entity();
    const e2 = new Entity();
    const e3 = world.createEntity('aaa');
    const e4 = new Entity();
    e4.addTo(e2);
	it('add entity', function () {
		expect(world.hasEntity(e1)).to.equal(false);
        world.add(e1).add(e1);
		expect(world.hasEntity(e1)).to.equal(true);
        e1.add(e2);
		expect(world.hasEntity(e2)).to.equal(true);
        world.remove(e1);
		expect(world.hasEntity(e1)).to.equal(false);
		expect(world.hasEntity(e2)).to.equal(false);
        expect(world.hasEntity(e3)).to.equal(true);
        expect(world.clearAllEntities()).to.equal(world);
        expect(world.hasEntity(e3)).to.equal(false);
        world.add(e1);
        e1.remove(e2);
		expect(world.hasEntity(e2)).to.equal(false);
        e2.addTo(e1);
		expect(world.hasEntity(e2)).to.equal(true);
		expect(world.hasEntity("999")).to.equal(false);

        world.add(e3);
		expect(world.hasEntity(e3)).to.equal(true);
        world.removeEntity("aaa");
		expect(world.hasEntity(e3)).to.equal(false);
	});
});

describe("world has system", function () {
    const world = new World();
    const s1 = new System(() => {
        return true;
    }, () => {});

    class SS extends System {
        handle() {
            return this;
        }
    }
	it('add system', function () {
		expect(world.hasSystem(s1)).to.equal(false);
        world.add(s1);
		expect(world.hasSystem(s1)).to.equal(true);
        world.remove(s1);
		expect(world.hasSystem(s1)).to.equal(false);
        world.add(s1);
        expect(world.clearAllSystems()).to.equal(world);
        expect(world.hasSystem(s1)).to.equal(false);
        world.add(s1);
        world.remove(SS);
        expect(world.hasSystem(s1)).to.equal(true);
        world.remove(System);
        expect(world.hasSystem(s1)).to.equal(false);
	});
});

describe("world run", function () {
    const world = new World();
	it('add system', function () {
		expect(world.run(0, 0)).to.equal(world);
        world.disabled = true;
		expect(world.run(0, 0)).to.equal(world);
	});
});

describe("world serialize", function () {
    const world = new World();
	it('add system', function () {
		expect(world.serialize().id).to.equal(world.id);
	});
});
