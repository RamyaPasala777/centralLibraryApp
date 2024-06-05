sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,ODataModel,Filter,FilterOperator,JSONModel) {
        "use strict";

        return Controller.extend("com.app.library.controller.HomePage", {
            onInit: function () {
                var oModel =new ODataModel("/v2/BooksSrv/");
                this.getView().setModel(oModel);
                const oLocalModel = new JSONModel({
                    userName: "",
                    password: "",
                    email: "",
                    phoneNumber: 0,
                    Address: "",
                    userType: "nonAdmin",
                   
                });
                this.getView().setModel(oLocalModel, "localModel");
            },

            loginbtn: function () {
                const router = this.getOwnerComponent().getRouter();
                router.navTo("RouteUserLoginPage")
            },
            AdminLogin: function () {
                const orouter = this.getOwnerComponent().getRouter();
                orouter.navTo("RouteAdminLoginPage")
            },
            loginbtn: async function () {
                if (!this.loginDialog) {
                    this.loginDialog = await this.loadFragment("loginPage")
                }
                this.loginDialog.open();
            },
            oncancelbtn: function () {
                if(this.loginDialog.isOpen()){
                this.loginDialog.close()
                }
            },
            
            signupbtn: async function () {
                if (!this.signupDialog) {
                    this.signupDialog = await this.loadFragment("signup")
                }
                this.signupDialog.open();
            },
            onsignupcancelbtn: function () {
                if(this.signupDialog.isOpen()){
                this.signupDialog.close()
                }
            },

            loginBtnClick: function () {
 
                var oView = this.getView();
 
                var sUsername = oView.byId("userr").getValue();  //get input value data in oUser variable
                var sPassword = oView.byId("pswd").getValue();    //get input value data in oPwd variable
 
                if (!sUsername || !sPassword) {
                    MessageToast.show("please enter username and password.");
                    return
                }
 
                var oModel = this.getView().getModel();
                oModel.read("/Users", {
                    filters: [
                        new Filter("userName", FilterOperator.EQ, sUsername),
                        new Filter("password", FilterOperator.EQ, sPassword)
 
                    ],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var userId = oData.results[0].ID;
                            var usertype = oData.results[0].userType;
                            MessageToast.show("Login Successful");
                            if (usertype === "nonAdmin") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteUserPage", { id: userId })
                            }
                            else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteAdminPage", { id: userId })
                            }
                        } else {
                            MessageToast.show("Invalid username or password.")
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("An error occured during login.");
                    }
                })
            },
            signupBtnClick: async function () {
               
       
            const oPayload = this.getView().getModel("localModel").getProperty("/"),
            oModel = this.getView().getModel("ModelV2");
        try {
            await this.createData(oModel, oPayload, "/Users");
            // this.getView().byId("idEmployeeTable").getBinding("items").refresh();
            this.signupDialog.close();
            MessageToast.show("SignUp Successful");
        } catch (error) {
            this.signupDialog.close();
        }
    }
        });
    });
