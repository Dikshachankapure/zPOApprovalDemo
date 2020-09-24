sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast',
	'sap/m/UploadCollectionParameter',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/ui/core/Fragment',
], function (Controller, MessageBox, MessageToast, UploadCollectionParameter, Dialog, Button, Fragment) {
	"use strict";

	return Controller.extend("POApproval.ZPOApproval.controller.POApprovalDetail", {

		//initialize Model
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("POApprovalDetail").attachPatternMatched(this._onEditMatched, this);

			var oModel = this.getOwnerComponent().getModel("PurchaseOrderSet");
			this.getView().setModel(oModel, "oModelPOSet");

			var oModel = this.getOwnerComponent().getModel("AttachmentItemsSet");
			this.getView().setModel(oModel, "oModelAttachment");

			var oModelHistory = this.getOwnerComponent().getModel("QueryHistorySet");
			this.getView().setModel(oModelHistory);
			var oModelAppHistory = this.getOwnerComponent().getModel("ApprovalHistorySet");
			this.getView().setModel(oModelAppHistory, "oModleApprovalHistory");

			//Show PDF in iframe

			var oHtml = this.getView().byId("idFrame");
			oHtml.setContent(
				"<iframe  src='https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy&embedded=true' height='600px' width='100%' ></iframe>"
			);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		handleNavButtonPress: function () {
			var oSplitApp = this.getView().getParent().getParent();
			var oMaster = oSplitApp.getMasterPages()[0];
			oSplitApp.toMaster(oMaster, "flip");
		},

		// on Route Matched
		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModel = this.getView().getModel("oModelPOSet");

			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtPONO = this.getView().byId("txtPONO");
			var txtPurOrdNo = this.getView().byId("PurOrdNo");
			var txtPODesc = this.getView().byId("PurOrdDesc");
			var txtPurOrdInt = this.getView().byId("PurOrdInt");
			var txtPurOrdVendor = this.getView().byId("PurOrdVendor");
			var txtPurOrdDocType = this.getView().byId("PurDocType");
			var txtPurOrdDt = this.getView().byId("PurOrdDt");
			var txtPurOrdSts = this.getView().byId("PurOrdSts");
			var txtPossPOSts = this.getView().byId("PossPOSts");
			var txtPONOOB = this.getView().byId("objcmp");
			var txtObjPrice = this.getView().byId("objPrice");
			var txtObjQuery = this.getView().byId("objQueryAttr");
			//	var Otitle = sap.ui.getCore().byId("idDialog");

			if (oParameters.arguments.PONumber !== "" || oParameters.arguments.PONumber !== null) {

				this.PONumber = oParameters.arguments.PONumber;

				for (var i = 0; i < oModel.getData().PurchaseOrder.length; i++) {
					if (oModel.getData().PurchaseOrder[i].PONumber.toString() === this.PONumber) {
						txtPONO.setText(this.PONumber);
						txtPurOrdNo.setText(oModel.getData().PurchaseOrder[i].PurchaseOrderNo);
						txtPODesc.setText(oModel.getData().PurchaseOrder[i].PODescription);
						txtPurOrdInt.setText(oModel.getData().PurchaseOrder[i].POInitiator);
						txtPurOrdVendor.setText(oModel.getData().PurchaseOrder[i].Vendor);
						txtPurOrdDocType.setText(oModel.getData().PurchaseOrder[i].DocumentType);
						txtPurOrdDt.setText(oModel.getData().PurchaseOrder[i].PODate);
						txtPurOrdSts.setText(oModel.getData().PurchaseOrder[i].Status);
						//		txtPossPOSts.setText(oModel.getData().PurchaseOrder[i].PossiblePOStatus);
						txtPONOOB.setText(oModel.getData().PurchaseOrder[i].PurchaseOrderNo);
						txtPONOOB.setTitle(oModel.getData().PurchaseOrder[i].icon);
						txtObjPrice.setTitle(oModel.getData().PurchaseOrder[i].Amount);
						txtObjPrice.setText(oModel.getData().PurchaseOrder[i].CurrencyCode);

						//	Otitle.setTitle(oModel.getData().PurchaseOrder[i].DocumentType);

						return false;
					}
				}

			} else {
				MessageBox.error("Incorrect Data");
			}
		},

		//Upload Attachments
		onUploadComplete: function (oEvent) {
			var oData = this.getView().byId("UploadCollection").getModel("oModelAttachment").getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": sUploadedFile,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",

			};

			aItems.unshift(oItem);
			this.getView().byId("UploadCollection").getModel("oModelAttachment").setData({
				"items": aItems
			});
			// Sets the text to the label
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			// delay the success message for to notice onChange message
			setTimeout(function () {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},

		// Before Upload Attachments
		onBeforeUploadStarts: function (oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},

		onUploadTerminated: function (oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},

		//Delete Attachment
		onFileDeleted: function (oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function (sItemToDeleteId) {
			var oData = this.getView().byId("UploadCollection").getModel("oModelAttachment").getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				};
			});
			this.getView().byId("UploadCollection").getModel("oModelAttachment").setData({
				"items": aItems
			});
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		getAttachmentTitleText: function () {
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		// Open Query Dialog//

		handleSelectDialogPress: function (oEvent) {

			var oButton = oEvent.getSource();

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Query", this);
				this._oDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();

			
			var oPONo = this.getView().byId("PurOrdNo").getText();
			var Title = "Purchase Order No: " + oPONo + " - Query";

			var oTitle = this._oDialog.setTitle(Title);
		},
		OnCancelQuery: function (oEvent) {
			this._oDialog.close();
		},

		_handleValueHelpUser: function (oEvent) {

			var oModelUser = this.getOwnerComponent().getModel("UserDataSet");
			this.getView().setModel(oModelUser);

			var sInputValueUser = oEvent.getSource().getValue();

			this.inputUserId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogUser) {
				this._valueHelpDialogUser = sap.ui.xmlfragment(
					"POApproval.ZPOApproval.fragments.ToUser", //id.fragments.file.name ---take id from manifest.json
					this
				);
				this.getView().addDependent(this._valueHelpDialogUser);
			}

			// create a filter for the binding

			this._valueHelpDialogUser.getBinding("items").filter([new sap.ui.model.Filter(
				"ToUser",
				sap.ui.model.FilterOperator.Contains, sInputValueUser
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogUser.open(sInputValueUser);

		},
		_handleValueHelpSearchUser: function (evt) {
			var sValueUser = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"ToUser",
				sap.ui.model.FilterOperator.Contains, sValueUser
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCloseUser: function (evt) {
			//	var	 inputUserId= oEvent.getSource().getId();
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				//var UserInput = this.getView().byId(this.inputUserId);
				var UserInput = sap.ui.getCore().byId(this.inputUserId);
				UserInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		SelectDialogPressApprove: function (oEvent) {

			var oButton = oEvent.getSource();

			if (!this._PressoDialog) {
				this._PressoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Approve", this);
				this._PressoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PressoDialog);
			this._PressoDialog.open();

			//To get the Value In Title Of Dialog
		
			var oPONo = this.getView().byId("PurOrdNo").getText();
			var TitleApprove = "Purchase Order No: " + oPONo + " - Query";

			var oTitle = this._PressoDialog.setTitle(TitleApprove);

			/*	if (!this._PressoDialog) {
					Fragment.load({
						name: "POApproval.ZPOApproval.fragments.Approve",
						controller: this
					}).then(function (oDialog) {
						this._PressoDialog = oDialog;
						this._PressoDialog.setModel(this.getView().getModel());
						//	this._configDialog(oButton);
						this._PressoDialog.open();

					}.bind(this));
				} else {
					//	this._configDialog(oButton);
					this._PressoDialog.open();
				}*/
		},

		OnCancelApprove: function () {
			this._PressoDialog.close();
		},

		SelectDialogPressReject: function (oEvent) {

			var oButton = oEvent.getSource();
			if (!this._RejectoDialog) {
				this._RejectoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Reject", this);
				this._RejectoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._RejectoDialog);
			this._RejectoDialog.open();

			var oPONo = this.getView().byId("PurOrdNo").getText();
			var Title = "Purchase Order No: " + oPONo + " - Query";

			var oTitle = this._RejectoDialog.setTitle(Title);

		},

		OnCancelReject: function () {
			this._RejectoDialog.close();
		},

	});

});