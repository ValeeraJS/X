/// <reference types="mocha" />
import { Component, World } from "../src";
import { expect } from "chai";
import { Entity } from "../src/Entity";

describe("entity has component", function () {
    const e1 = new Entity();
    const c = new Component(0, "Component");
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
        e1.remove(Component);
		expect(e1.hasComponent(c)).to.equal(false);

        e1.add(c);
		expect(e1.hasComponent(c)).to.equal(true);
        e1.removeComponent(c.name);
		expect(e1.hasComponent(c)).to.equal(false);

        class BBB extends Component<any> {}
        const bbb = new BBB();
        e1.add(bbb);
		expect(e1.hasComponent(bbb)).to.equal(true);
        e1.remove(Component);
		expect(e1.hasComponent(bbb)).to.equal(true);

	});
});

describe("entity clone", function () {
    const e1 = new Entity();
    const c = new Component(0);
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
    const c = new Component(0);
    const world = new World();
	it('entity destroy', function () {
        world.add(e1);
        e1.addComponent(c);
		e1.destroy();
        expect(e1.hasComponent(c)).to.equal(false);
        expect(world.hasEntity(e1)).to.equal(false);
	});
});

describe("entity add component", function () {
    const e1 = new Entity();
    class TestC extends Component<number> {
        constructor(value: number) {
            super(value, "testC");
        }
    }

    class E2 extends Entity {
        aaa: number;
        bbb: string;
        constructor(aaa: number, bbb: string) {
            super();
            this.aaa = aaa;
            this.bbb = bbb;
        }
    }
	it('entity add', function () {
        e1.addComponent(TestC, 111);
        expect(e1.hasComponent(TestC)).to.equal(true);
        const c = e1.getComponent(TestC);
        expect(c?.data).to.equal(111);

        e1.add(E2, 111, 'aaa');
        expect(e1.children[0] instanceof E2).to.equal(true);

        e1.addChild(E2, 111, 'aaa');
        expect(e1.children[1] instanceof E2).to.equal(true);
	});
});
