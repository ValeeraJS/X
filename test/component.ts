import { Component, Entity } from "../src";
import { expect } from "chai";

describe("Component", function () {
    const c = new Component(1, []);
    it('dirty', function () {
        expect(c.dirty).to.equal(false);
        c.dirty = true;
        expect(c.dirty).to.equal(true);
    });

    it('serialize', function () {
        const json = c.serialize();
        expect(json.data).to.equal(c.data);

        const cc = Component.unserialize(json);
        expect(cc.data).to.equal(c.data);
        expect(cc.id === c.id).to.equal(false);

        const c2 = new Component();
        expect(c2.data).to.equal(null);

        const c3 = new Component(1, []);
        expect(c3.data).to.equal(1);
        expect(c3.tags.length).to.equal(0);
    });

    it('tags', function () {
        const c1 = new Component(1, [{label: 'aaa', unique: true}]);
        const c2 = new Component(2, [{label: 'aaa', unique: true}]);
        const e = new Entity();

        e.add(c1).add(c2).add(c2);
        expect(e.hasComponent(c1)).to.equal(false);
        expect(e.hasComponent(c2)).to.equal(true);
    });
});
