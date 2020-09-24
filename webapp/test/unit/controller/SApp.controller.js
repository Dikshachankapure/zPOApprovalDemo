/*global QUnit*/

sap.ui.define([
	"POApproval/ZPOApproval/controller/SApp.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SApp Controller");

	QUnit.test("I should test the SApp controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});