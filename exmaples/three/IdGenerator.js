(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.IdGenerator = factory());
}(this, (function () { 'use strict';

	/**
	 * @class
	 * @classdesc 数字id生成器，用于生成递增id
	 * @param {number} [initValue = 0] 从几开始生成递增id
	 */
	class IdGenerator {
	    constructor(initValue = 0) {
	        this.value = this.initValue = initValue;
	    }
	    current() {
	        return this.value;
	    }
	    next() {
	        return ++this.value;
	    }
	    skip(value = 1) {
	        if (value < 1) {
	            value = 1;
	        }
	        this.value += value;
	        return ++this.value;
	    }
	}

	return IdGenerator;

})));
