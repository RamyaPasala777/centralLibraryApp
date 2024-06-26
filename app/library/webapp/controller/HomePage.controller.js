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

 AvailableBooksBtn: async function () {
                if (!this.libraryinfo) {
                    this.libraryinfo = await this.loadFragment("libraryinfo")
                }
                this.libraryinfo.open();
            },
            onlibraryclosedialog: function () {
                if(this.libraryinfo.isOpen()){
                this.libraryinfo.close()
                }
            },

            signupBtnClick: async function () {
                
            
            const oPayload = this.getView().getModel("localModel").getProperty("/"),
            oModel = this.getView().getModel("ModelV2");

            if (!(oPayload.userName) ) {
               MessageToast.show("please enter userName")
               return
            }
            else if(!(oPayload.password)){
                MessageToast.show("please enter the password")
                return
            }
          

            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                var phoneRegex=/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
                if(!(emailRegex.test(oPayload.email)&&phoneRegex.test(oPayload.phoneNumber))){
                    MessageToast.show("please enter valid Email and PhoneNumber")
                    return
                }
        try {
            await this.createData(oModel, oPayload, "/Users");
            // this.getView().byId("idEmployeeTable").getBinding("items").refresh();
            this.signupDialog.close();
            MessageToast.show("SignUp Successful");
        } catch (error) {
            MessageToast.show("User already exists.please enter the valid details")
            // this.signupDialog.close();
        }
    },
      // Emali condition Check
      onEmailLiveChange: async function(oEvent) {
        var oEmail = oEvent.getSource();
        var oVal = oEmail.getValue();
        // Regular expression for validating email
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (oVal.trim() === '') {
            oEmail.setValueState("None"); // Clear any previous state
        } else if (oVal.match(regexp)) {
            oEmail.setValueState("Success");
        } else {
            oEmail.setValueState("Error");
            // Check if MessageToast is available before showing message
            if (sap.m.MessageToast) {
                sap.m.MessageToast.show("Invalid Email format");
            } else {
                console.error("MessageToast is not available.");
            }
        }
    },
    onhandleCompanyQuickViewPress : async function () {
        if (!this.notificationDialog1) {
            this.notificationDialog1 = await this.loadFragment("HomePageCompanyDetails")
        }
        this.notificationDialog1.open();
      },
       onAdminDetailscancelbtn: function () {
        this.notificationDialog1.open();
        this.notificationDialog1.close();
        
      },
      

    onMobileVal:async function(oEvent)
    {
        var oPhone  = oEvent.getSource();
        var oVal1 = oPhone.getValue();

        // regular expression for validating the phone
        var regexpMobile = /^[0-9]{10}$/;
        if (oVal1.trim() === '') {
            oPhone.setValueState("None"); // Clear any previous state
        } else if (oVal1.match(regexpMobile)) {
            oPhone.setValueState("Success");
        } else {
            oPhone.setValueState("Error");
            // Check if MessageToast is available before showing message
            if (sap.m.MessageToast) {
                sap.m.MessageToast.show("Invalid Phone format");
            } else {
                console.error("MessageToast is not available.");
            }
        }   

    }
        });
    });
