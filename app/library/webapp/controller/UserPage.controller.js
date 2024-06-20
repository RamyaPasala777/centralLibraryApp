sap.ui.define(
    [
      "./BaseController",

        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/Token",
        "sap/m/MessageBox"
    ],
    function(Controller,Filter,FilterOperator,Token) {
      "use strict";
  
      return Controller.extend("com.app.library.controller.UserPage", {
        onInit: function() {


          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onUserDetailsLoad,this);

          const oView1 = this.getView();
                const oMulti1 = oView1.byId("idTitleFilterValue");
                const oMulti2 = oView1.byId("idAuthorFilterValue");
                const oMulti4 = oView1.byId("idISBNFilterValue");
 
                let validate = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                };
                oMulti1.addValidator(validate);
                oMulti2.addValidator(validate);
                oMulti4.addValidator(validate);
 
            },
        
       onUserDetailsLoad:function(oEvent){
           const{id}=oEvent.getParameter("arguments");
           this.ID=id;
           //const sRouterName=oEvent.getParameter("name");
           const oObjectPage=this.getView().byId("idUserPage");

           oObjectPage.bindElement(`/Users(${id})`);
       },
       formatPhoneNumber: function(phoneNumber) {             
        if (typeof phoneNumber === "string") {                 
        return phoneNumber.replace(/,/g, "");             
        }             
        return phoneNumber; 
        },
        onAllBooksFilterPress:function(oEvent){
            var userId=oEvent.getSource().getParent().getBindingContext().getObject().ID;
            console.log(userId)
            const oRouter=this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteallBooksPage",{
                id:userId
            });

        },
        onGoPress1: function () {
          const oView = this.getView(),

              titleFilter = oView.byId("idTitleFilterValue"),
              stitle = titleFilter.getTokens(),

              authorFilter = oView.byId("idAuthorFilterValue"),
              sauthor = authorFilter.getTokens(),

              ISBNFilter = oView.byId("idISBNFilterValue"),
              sISBN = ISBNFilter.getTokens(),

              Table = oView.byId("idUsersTable"),
              aFilters = [];

          sISBN.filter((ele) => {
              ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : "";
          })   
          stitle.filter((ele) => {
              ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
          })
          sauthor.filter((ele) => {
              ele ? aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey())) : "";
          })


          Table.getBinding("items").filter(aFilters);

      
        },
        onClearFilterPress1: function () {
          const view = this.getView(),
              clearTitle = view.byId("idTitleFilterValue"),
              stitle = clearTitle.removeAllTokens(),
          clearauthor = view.byId("idAuthorFilterValue"),
              sAuthor = clearauthor.removeAllTokens(),
          cleargenre = view.byId("idGenreFilterValue"),
              sgenre = cleargenre.removeAllTokens(),
          clearISBN = view.byId("idISBNFilterValue"),
              sISBN = clearISBN.removeAllTokens()
      },
      onNotificationFilterPress: async function () {
        if (!this.notificationDialog) {
            this.notificationDialog = await this.loadFragment("notifications2")
        }
        this.notificationDialog.open();
        const oObjectPage = this.getView().byId("idnotifyDialog");
        oObjectPage.bindElement(`/Users(${this.ID})`);
    },
    onCloseDialog: function () {
        if (this.notificationDialog.isOpen()) {
            this.notificationDialog.close()
        }
    },
    logout1:function(){
      var oRouter=this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteHomePage",{},true)  
    }
      });
    }
  );
  