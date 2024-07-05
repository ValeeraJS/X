import { Component } from "../src";
import { expect } from "chai";

describe("Component", function () {
    const c = new Component(1);
    it('data', function () {
        expect(c.data).to.equal(1);
    });
});
