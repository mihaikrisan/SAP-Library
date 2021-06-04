sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel"
], function (Controller, Fragment, ResourceModel) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
        onInit: function () {
            this.book = {
                Isbn: null,
                Author: null,
                Title: null,
                DatePublished: null,
                Language: null,
                TotalNumberOfBooks: null,
                NumberAvailableBooks: null
            }

            var i18nModel = new ResourceModel({
                bundleName: "org.ubb.books.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");

            this.isAdding = null;
        },

        handleAddBook: function (oEvent) {
            this.isAdding = true;

            var oView = this.getView();

            if (!this.bookDialog) {
                this.bookDialog = Fragment.load({
                    id: oView.getId(),
                    name: "org.ubb.books.view.BookDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.bookDialog.then((oDialog) => {
                var oModel = new sap.ui.model.json.JSONModel();

                oDialog.setModel(oModel);
                oDialog.getModel().setData(JSON.parse(JSON.stringify(this.book)));

                oDialog.open();
            });
        },

        handleEditBook: function (oEvent) {
            this.isAdding = false;

            var oCurrentBook = oEvent.getSource().getBindingContext().getObject();

            var oView = this.getView();

            if (!this.bookDialog) {
                this.bookDialog = Fragment.load({
                    id: oView.getId(),
                    name: "org.ubb.books.view.BookDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.bookDialog.then((oDialog) => {
                var oModel = new sap.ui.model.json.JSONModel();

                oDialog.setModel(oModel);
                oDialog.getModel().setData(oCurrentBook);

                oDialog.open();
            });
        },

        handleDeleteBook: function (oEvent) {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY_MIKR_SRV_01/");

            var sPath = "/Books('" + oEvent.getSource().getBindingContext().getObject().Isbn + "')";

            oModel.remove(sPath, { success: () => { this.successHandler() }, error: () => { this.errorHandler() } });
        },

        handleSaveBtnPress: function (oEvent) {
            var oDialogData = oEvent.getSource().getModel().getData();
            if (oDialogData.Isbn === null || oDialogData.Isbn === "") {
                window.alert('Please fill ISBN field!');
                return;
            }

            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY_MIKR_SRV_01/");

            if (this.isAdding) {
                oModel.create("/Books", oDialogData, { success: () => { this.successHandler() }, error: () => { this.errorHandler() } });
            } else {
                var sPath = "/Books('" + oDialogData.Isbn + "')";
                oModel.update(sPath, oDialogData, { success: () => { this.successHandler() }, error: () => { this.errorHandler() } });
            }

            var oView = this.getView();
            oView.byId("bookFormDialog").close();
        },

        handleCancelBtnPress: function () {
            var oView = this.getView();

            oView.byId("bookFormDialog").close();
        },

        successHandler: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMsg = oBundle.getText("successMessage");

            window.alert(sMsg);
            location.reload();
        },

        errorHandler: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMsg = oBundle.getText("errorMessage");

            window.alert(sMsg);
        }
    });
});