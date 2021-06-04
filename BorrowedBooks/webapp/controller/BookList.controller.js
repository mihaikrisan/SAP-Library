sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
        onInit: function () {
        },

        clearAllFilters: function (oEvent) {
            var oTable = this.byId("table");

            var aColumns = oTable.getColumns();
            for (var i = 0; i < aColumns.length; i++) {
                oTable.filter(aColumns[i], null);
            }
        },

        clearSort: function (oEvent) {
            var oTable = this.byId("table");

            var aColumns = oTable.getColumns();
            for (var i = 0; i < aColumns.length; i++) {
                oTable.sort(aColumns[i], null);
            }
        }
    });
});