sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
        onInit: function () {
        },

        search: function () {
            var filtersArray = [];
            var isbn = this.getView().byId("isbnInput").getValue();
            var author = this.getView().byId("authorInput").getValue();
            var title = this.getView().byId("titleInput").getValue();
            var datePublished = this.getView().byId("dateInput").getValue();
            var language = this.getView().byId("languageInput").getValue();

            if (isbn !== "") {
                filtersArray.push(new Filter("Isbn", FilterOperator.EQ, isbn));
            }

            if (author !== "") {
                filtersArray.push(new Filter("Author", FilterOperator.Contains, author));
            }

            if (title !== "") {
                filtersArray.push(new Filter("Title", FilterOperator.Contains, title));
            }

            if (datePublished !== "") {
                filtersArray.push(new Filter("DatePublished", FilterOperator.EQ, datePublished));
            }

            if (language !== "") {
                filtersArray.push(new Filter("Language", FilterOperator.EQ, language));
            }

            this.byId("table").getBinding().filter(new Filter(filtersArray, true), "Application");

        },

        checkOutBook: function (oEvent) {
            var oData = oEvent.getSource().getBindingContext().getObject();
            oData.NumberAvailableBooks = oData.NumberAvailableBooks - 1;
            var sPath = "/SearchBookEntries('" + oData.Isbn + "')";

            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY_MIKR_SRV_01/");
            oModel.update(sPath, oData, { success: () => { this.successHandler() }, error: () => { this.errorHandler() } });
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