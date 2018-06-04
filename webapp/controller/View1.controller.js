sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	'sap/ui/model/json/JSONModel'
], function(Controller,Filter,JSONModel) {
	"use strict";

	return Controller.extend("QASAddressSearch.controller.View1", {
		
		onInit: function() {
			var oViewModel = new JSONModel({
				"busy": false,
				"delay": 0
			});
			this.getView().setModel(oViewModel, "ViewHelper");
		},
		
		onAddressChanged: function(event){
		  
		},
		
		onAddressSuggest: function(event){
			
			event.getSource().getBinding("suggestionRows").attachDataRequested(
				function(){
					this.getView().getModel("ViewHelper").setProperty("/busy",true);
				}, this
			);
			
			event.getSource().getBinding("suggestionRows").attachDataReceived(
				function(){
					this.getView().getModel("ViewHelper").setProperty("/busy",false);
				}, this
			);
			
			event.getSource().getBinding("suggestionRows").filter(
				this._applyAddressFilter(event.getParameter("suggestValue"))
			);
		},
		
		onAddressSelected: function(event){
			
		},
		
		onAddressValueHelpRequest: function(event){
			// Create the dialog if it isn't already
			if (!this._addressDialog) {
				this._addressDialog = sap.ui.xmlfragment("QASAddressSearch.fragment.AddressHelpDialog", this);
				this.getView().addDependent(this._addressDialog);
			}
			
			this._addressDialog.getBinding("items").filter(this._applyAddressFilter(event.getSource().getValue()));
			
			// Display the popup
			this._addressDialog.open();
			this._addressDialog._oSearchField.setValue(event.getSource().getValue());
		},
		
		onAddressValueHelpSearch: function(event){
			event.getSource().getBinding("items").filter(this._applyAddressFilter(event.getParameter("value")));
		},
		
		_applyAddressFilter: function(addressString){
			
			var filters = [];
			if (addressString) {
				filters.push(new Filter('PartialAddress', sap.ui.model.FilterOperator.StartsWith, addressString));
			}
			return filters;
		}	

	});
});