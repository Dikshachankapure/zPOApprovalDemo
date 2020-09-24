sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'POApproval/ZPOApproval/utils/Formatter',
	'sap/ui/model/Filter',
	'sap/m/MessageToast',
], function (Controller, Formatter, Filter, MessageToast) {
	"use strict";

	return Controller.extend("POApproval.ZPOApproval.controller.POApprovalMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("PurchaseOrderSet");
			this.getView().setModel(oModel);

		},
		

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oFilter = new sap.ui.model.Filter({
				// two filters
				filters: [
					new sap.ui.model.Filter("PurchaseOrderNo", sap.ui.model.FilterOperator.Contains, sQuery), // filter for value 1
				]
			});
			var oBinding = this.byId("listPO").getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		onListItemPress: function (oEvent) {
			var objEdit = oEvent.getSource().getBindingContext().getObject();
			this.getRouter().navTo("POApprovalDetail", {
				PONumber: objEdit.PONumber
			});

		},

		handleOpenDialog: function (oEvent) {

			var oButton = oEvent.getSource();
			if (!this._oDialogFilter) {
				this._oDialogFilter = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Filter", this);
				this._oDialogFilter.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilter);
			this._oDialogFilter.open();

		},

		/*	handleConfirm: function (oEvent) {

			var that = this;
				var query1 = this.getView().getSelectedFilterItems;
			///	var query2 = this.getView().byId("fltDocType").getKey();
				var oFilter = new sap.ui.model.Filter({
					// two filters
					filters: [
						new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, query1), // filter for value 1
					//	new sap.ui.model.Filter("DocumentType", sap.ui.model.FilterOperator.Contains, query2), // filter for value 1

					]
				});
				var oBinding = this.byId("listPO").getBinding("items");
				oBinding.filter(oFilter, sap.ui.model.FilterType.Application);

			},*/

		/*	handleConfirm: function (oEvent) {
				var Query = oEvent.getParameter("query");
				var oFilter = new sap.ui.model.Filter({
					// two filters
					filters: [
						new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, Query),
						new sap.ui.model.Filter("DocumentType", sap.ui.model.FilterOperator.Contains, Query),
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Query),
						new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.Contains, Query),// filter for value 1
					]
				});
				var oBinding = this.byId("listPO").getBinding("items");
				oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
			},*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onExit: function() {
		//
		//	}

	});

});