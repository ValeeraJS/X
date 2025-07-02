/// <reference types="mocha" />
import { System, unsortedRemove, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("world has entity", function () {
    const world = new World();
    const e1 = new Entity();
    const e2 = new Entity();
    const e3 = world.createEntity('aaa');
    const e4 = new Entity();
    e2.add(e4);
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
        expect(world.clearEntities()).to.equal(world);
        expect(world.hasEntity(e3)).to.equal(false);
        world.add(e1);
        e1.remove(e2);
        expect(world.hasEntity(e2)).to.equal(false);
        e1.add(e2);
        expect(world.hasEntity(e2)).to.equal(true);
        expect(world.hasEntity("999")).to.equal(false);

        world.add(e3);
        expect(world.hasEntity(e3)).to.equal(true);
        world.removeEntity("aaa");
        expect(world.hasEntity(e3)).to.equal(false);

        world.clearEntities();
        e1.add(e2);
        e3.add(e4);
        world.add(e1).add(e3);
        expect(world.rootEntities.length).to.equal(2);

        world.add(new System(() => true));
        world.destroy();
        expect(world.rootEntities.length).to.equal(0);
    });
});

describe("world has system", function () {
    const world = new World();
    const s1 = new System(() => {
        return true;
    }, () => { });

    class SS extends System {
        handle() {
            return this;
        }
    }

    class SSS extends System {
        v: number;
        constructor(v: number) {
            super(() => true);
            this.v = v;
        }
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
        expect(world.clearSystems()).to.equal(world);
        expect(world.hasSystem(s1)).to.equal(false);
        world.add(s1);
        world.remove(SS);
        expect(world.hasSystem(s1)).to.equal(true);
        world.remove(System);
        expect(world.hasSystem(s1)).to.equal(false);
        world.add(SSS, 1);
        expect(world.hasSystem(SSS)).to.equal(true);
    });
});

describe("world run", function () {
    const world = new World();
    it('add system', function () {
        expect(world.update()).to.equal(world);
        world.disabled = true;
        expect(world.update(0, 0)).to.equal(world);
    });
});

describe("world clear", function () {
    const world = new World();
    world.addSystem(new System(() => true)).addEntity(new Entity('aaa'));
    it('add system', function () {
        expect(world.entities.size).to.equal(1);
        expect(world.systems.size).to.equal(1);

        expect(world.getEntity('aaa')!.name).to.equal('aaa');

        world.clear();

        expect(world.entities.size).to.equal(0);
        expect(world.systems.size).to.equal(0);
    });
});

describe("2 world", function () {
    const world1 = new World();
    const world2 = new World();

    const s = new System(() => true);
    const e = new Entity();

    world1.add(s).add(e);
    world2.add(s).add(e);

    it('add system', function () {
        expect(world1.entities.size).to.equal(1);
        expect(world1.systems.size).to.equal(1);

        world1.destroy();

        expect(world2.entities.size).to.equal(1);
        expect(world2.systems.size).to.equal(1);
    });
});

describe("unsort remove", function () {
    const arr = [0, 1, 2, 3, 4, 5, 6];

    it('remove', function () {
        unsortedRemove(arr, 0);
        expect(arr[0]).to.equal(6);
    });
});

describe("add class", function () {
    class E2 extends Entity {
        n: number;
        constructor(n: number) {
            super();
            this.n = n;
        }
    }

    class S2 extends System {
        aaa: number;
        constructor(aaa: number) {
            super(() => true);
            this.aaa = aaa;
        }
    }

    const world = new World();

    it('add', function () {
        world.add(E2, 1);
        expect(world.entities.size).to.equal(1);
        world.addEntity(E2, 1);
        expect(world.entities.size).to.equal(2);
        world.add(S2, 2);
        expect(world.systems.size).to.equal(1);
        world.addSystem(S2, 2);
        expect(world.systems.size).to.equal(2);
    });
});
