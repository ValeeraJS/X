import { Component, System, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("System", function () {
    const world = new World();
    const e1 = new Entity();
    const e2 = new Entity();
    const c = new Component(1, []);
    e2.add(c).addTo(e1);
    const s = new System((e) => {
        return e.hasComponent(Component);
    }, (e, time) => {
        e.getComponent<number>(Component).data += time;
    });
    const s2 = new System((e) => {
        return e.hasComponent(Component);
    }, (e, time) => {
        e.getComponent<number>(Component).data += time;
    }, undefined, undefined, 'ooo');
    world.add(s).add(e1);
    it('run', function () {
        world.run(1, 1);
        world.removeSystem('000');
        world.removeSystem(s2);
        expect(c.data).to.equal(2);
        e1.remove(e2);
        world.run(2, 1);
        expect(c.data).to.equal(2);
        world.removeSystem(s.name);
        world.run(3, 1);
        expect(c.data).to.equal(2);

        world.add(s2);
        e1.add(c);
        world.run(4, 1);
        s2.disabled = true;
        world.add(s2);
        world.run(4, 1);
        expect(c.data).to.equal(6);
        e1.remove(c);

        expect(s2.run(world, 1, 1)).to.equal(s2);
    });

    it('priority', function () {
        world.add(s);
        expect(s.priority).to.equal(0);
        s.priority = 1;
        expect(s.priority).to.equal(1);
    });


    it('disabled and destroy', function () {
        s.disabled = true;
        world.add(s);
        world.run(1, 1);
        expect(c.data).to.equal(6);
        s.destroy();
        expect(world.hasSystem(s)).to.equal(false);
    });

    it('dynamic multi', function () {
        const s = new System((e) => {
            return e.hasComponent('aaa');
        }, (e) => {
            e.getComponent<number>('aaa').data++;
        });
        const c = new Component(1, [], 'aaa');
        const entity = new Entity();
        const world1 = new World();
        const world2 = new World();
        world1.add(s).add(entity);
        world1.run(1, 1);
        entity.add(c);
        world2.add(s).add(entity);
        world1.run(1, 1);
        world2.run(1, 1);
        expect(c.data).to.equal(3);
    });

    it('serialize', function () {
        const json = (new System(() => true, () => {}, undefined, undefined, 'aaa')).serialize();
        expect(json.name).to.equal('aaa');
    });

    it('has no system', function () {
        expect(world.systemManager.get(-1)).to.equal(null);
        class TestSystem extends System {};
        class TestEntity extends Entity {};
        expect(world.systemManager.get(TestSystem)).to.equal(null);
        expect(world.hasSystem(TestSystem)).to.equal(false);
        expect(world.removeEntity(TestEntity)).to.equal(world);
        expect(world.removeEntity(-1)).to.equal(world);
    });
});
