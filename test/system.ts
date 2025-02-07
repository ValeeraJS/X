/// <reference types="mocha" />
import { Component, System, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("System", function () {
    const world = new World();
    const e1 = new Entity('e1');
    const e2 = new Entity('e2');
    const c = new Component(1);
    e1.add(e2.add(c));
    const s = new System((e) => {
        return e.hasComponent(Component);
    }, (e, time) => {
        e.getComponent<number>(Component)!.data! += time;
    });
    const s2 = new System((e) => {
        return e.hasComponent(Component);
    }, (e, time) => {
        e.getComponent<number>(Component)!.data! += time;
    }, 'ooo');
    world.add(s).add(e1);
    it('run', function () {
        world.update(1, 1);
        world.removeSystem('000');
        world.removeSystem(s2);
        expect(c.data).to.equal(2);
        e1.remove(e2);
        world.update(2, 1);
        expect(c.data).to.equal(2);
        world.removeSystem(s.name);
        world.update(3, 1);
        expect(c.data).to.equal(2);

        world.add(s);
        e1.add(e2);
        world.update(1, 1);
        expect(c.data).to.equal(3);
        s.autoUpdate = false;
        world.update(1, 1);
        expect(c.data).to.equal(3);
        world.remove(s);
        e1.remove(e2);
        c.data = 2;


        world.add(s2);
        e1.add(c);
        world.update(4, 1);
        s2.disabled = true;
        world.add(s2);
        world.update(4, 1);
        expect(c.data).to.equal(6);
        e1.remove(c);

        expect(s2.update(world, 1, 1)).to.equal(s2);
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
        world.update(1, 1);
        expect(c.data).to.equal(6);
        s.destroy();
        expect(world.hasSystem(s)).to.equal(false);
    });

    it('dynamic multi', function () {
        const s = new System((e) => {
            return e.hasComponent('aaa');
        }, (e) => {
            e.getComponent<number>('aaa')!.data!++;
        });
        const c = new Component(1, 'aaa');
        const entity = new Entity();
        const world1 = new World();
        const world2 = new World();
        world1.add(s).add(entity);
        world1.update(1, 1);
        entity.add(c);
        world2.add(s).add(entity);
        world1.update(1, 1);
        world2.update(1, 1);
        expect(c.data).to.equal(3);
    });

    it('has no system', function () {
        expect(world.getSystem(-1)).to.equal(null);
        class TestSystem extends System {};
        class TestEntity extends Entity {};
        expect(world.getSystem(TestSystem)).to.equal(null);
        expect(world.hasSystem(TestSystem)).to.equal(false);
        expect(world.removeEntity(TestEntity)).to.equal(world);
        expect(world.removeEntity(-1)).to.equal(world);
    });

    it('without handler', function () {
        const s = new System(() => {return true;});
        s.handle(new Entity(), 0, 0, new World());
        expect(s).to.equal(s);
    });
});
