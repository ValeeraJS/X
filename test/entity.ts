/// <reference types="mocha" />
import { Component, World, Entity, componentAccessor } from "../src";
import { expect } from "chai";

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

        class BBB extends Component<any> { }
        const bbb = new BBB();
        e1.add(bbb);
        expect(e1.hasComponent(bbb)).to.equal(true);
        expect(e1.hasComponent(Component)).to.equal(true);
        expect(e1.hasComponent(Component, true)).to.equal(false);
        e1.remove(Component);
        expect(e1.hasComponent(bbb)).to.equal(false);

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

describe("entity tags", function () {
    const e1 = new Entity();
    class TestA extends Component<number> {
        constructor(value: number) {
            super(value, "testA");
        }
    }

    class TestB extends Component<number> {
        constructor(value: number) {
            super(value, "testB");
        }
    }

    class TestC extends Component<number> {
        constructor(value: number) {
            super(value, "testC");
        }
    }

    const tagA: any[] = [];
    const tagB = [TestA, TestB];

    Entity.setTag('tagA', tagA);
    Entity.setTag('tagB', tagB);
    Entity.setTag('tagC', ['tagA', 'tagB', TestC]);

    it('entity tag', function () {
        expect(e1.isFitTag("aaa")).to.equal(false);
        expect(e1.isFitTag("tagA")).to.equal(true);
        expect(e1.isFitTag("tagB")).to.equal(false);

        e1.addComponent(new TestA(1));
        expect(e1.isFitTag("tagA")).to.equal(true);
        expect(e1.isFitTag("tagB")).to.equal(false);
        e1.addComponent(new TestB(1));
        expect(e1.isFitTag("tagB")).to.equal(true);
        expect(e1.isFitTag("tagC")).to.equal(false);
        e1.addComponent(new TestC(1));
        expect(e1.isFitTag("tagC")).to.equal(true);

        Entity.removeTag("tagC");
        expect(e1.isFitTag("tagC")).to.equal(false);

        Entity.setTag('tagC', ['tagA', 'tagB', TestC]);
        e1.components.clear();
        e1.fitTag("tagC");
        e1.fitTag("tagX");
        expect(e1.isFitTag("tagC")).to.equal(true);
        expect(e1.isFitTag("tagX")).to.equal(false);
    });
});

describe("as component", function () {
    class TestA extends Component<number> {
        constructor(value: number) {
            super(value, "testA");
        }
    }

    class TestB extends Component<number> {
        constructor(value: number) {
            super(value, "testB");
        }
    }

    @componentAccessor('testa')
    @componentAccessor('testb')
    class XXXEntity extends Entity {
        testa: TestA = new TestA(1);

        constructor(name: string) {
            super(name);
        }
    }

    it('entity accessor', function () {
        const x = new XXXEntity('xxx');
        expect(x.hasComponent(TestA)).to.equal(true);
        x.testa = TestA as any;
        expect(x.testa.data).to.equal(undefined);

        expect(x.hasComponent(TestB)).to.equal(false);
        (x as any).testb = TestB as any;
        expect(x.hasComponent(TestB)).to.equal(true);
    });
});

describe("strict mode", function () {
    class TestA extends Component<number> {
        constructor(value: number) {
            super(value, "testA");
        }
    }

    const e = new Entity();
    e.add(TestA, 1);

    it('entity accessor', function () {
        expect(e.hasComponent(TestA, true)).to.equal(true);
        expect(e.hasComponent(Component, true)).to.equal(false);
        expect(e.getComponent(TestA, true) instanceof TestA).to.equal(true);
        expect(e.getComponent(Component, true) instanceof TestA).to.equal(false);

        e.remove(Component, true);
        expect(e.hasComponent(TestA, true)).to.equal(true);
        e.remove(TestA, true);
        expect(e.hasComponent(TestA, true)).to.equal(false);
    });
});
