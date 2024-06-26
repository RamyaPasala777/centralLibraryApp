sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox, Token, MessageToast) {
        "use strict";
 
        return Controller.extend("com.app.library.controller.AdminPage", {
            onInit: function () {
                this.oQuantity = null;
                this.oAq = null;
                const oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRoutePatternMatched(this.onUserDetailsLoad,this);
        //         var oTable = this.byId("activeloansTable");
 
         
        //   var oColumn = oTable.getColumns()[7]; // Index 1 represents the second column
     
        //   // Hide the column
        //   oColumn.setVisible(false);
                const oLocalModel = new JSONModel({
 
                    ISBN: "",
                    title: "",
                    quantity: "",
                    author: "",
                    genre: "",
                    availability: "",
                    language: "",
 
                });
                this.getView().setModel(oLocalModel, "localModel");
 
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onBookListLoad, this);
 
                const oView1 = this.getView();
                const oMulti1 = oView1.byId("idTitleFilterValue");
                const oMulti2 = oView1.byId("idAuthorFilterValue");
                const oMulti3 = oView1.byId("idGenreFilterValue");
                const oMulti4 = oView1.byId("idISBNFilterValue");
 
                let validate = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new Token({ key: text, text: text });
                    }
                };
                oMulti1.addValidator(validate);
                oMulti2.addValidator(validate);
                oMulti3.addValidator(validate);
                oMulti4.addValidator(validate);
 
            },
            setHeaderContext: function () {
                var oView = this.getView();
                oView.byId("Bookstitle").setBindingContext(
                    oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
            },
 
           
            onBookListLoad: function () {
                this.getView().byId("idBookTable").getBinding("items").refresh();
            },
            onUserDetailsLoad:function(oEvent){
                const{id}=oEvent.getParameter("arguments");
                this.ID=id;
                //const sRouterName=oEvent.getParameter("name");
                const oObjectPage=this.getView().byId("idBooksListPage");
     
                oObjectPage.bindElement(`/Users(${id})`);
            },
 
            onGoPress: function () {
                const oView = this.getView(),
 
                    titleFilter = oView.byId("idTitleFilterValue"),
                    stitle = titleFilter.getTokens(),
 
                    authorFilter = oView.byId("idAuthorFilterValue"),
                    sauthor = authorFilter.getTokens(),
 
                    genreFilter = oView.byId("idGenreFilterValue"),
                    sgenre = genreFilter.getTokens(),
 
                    ISBNFilter = oView.byId("idISBNFilterValue"),
                    sISBN = ISBNFilter.getTokens(),
 
                    Table = oView.byId("idBookTable"),
                    aFilters = [];
 
                sISBN.filter((ele) => {
                    ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : "";
                });
 
                sgenre.filter((ele) => {
                    ele ? aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey())) : "";
                });
                stitle.filter((ele) => {
                    ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
                })
                sauthor.filter((ele) => {
                    ele ? aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey())) : "";
                })
 
 
                Table.getBinding("items").filter(aFilters);
 
            },
            onClearFilterPress: function () {
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
            onCreateBtnPress: async function () {
                if (!this.createDialog) {
                    this.createDialog = await this.loadFragment("createBooks")
                }
                this.createDialog.open();
            },
            onCloseCreateDialog: function () {
                if (this.createDialog.isOpen()) {
                    this.createDialog.close()
                }
               
            },
            onDeleteBtnPress: async function () {
                var aSelectedItems = this.byId("idBookTable").getSelectedItems();
                MessageBox.confirm("Are you sure want to delete the book",{
                    onClose:function(oAction){
                        if(oAction===MessageBox.Action.OK){
                            if (aSelectedItems.length > 0) {
                                var aISBNs = [];
                                aSelectedItems.forEach(function (oSelectedItem) {
                                    var sISBN = oSelectedItem.getBindingContext().getObject().isbn;
                                    var oQuantity=oSelectedItem.getBindingContext().getObject().quantity
                                    var oAvaiableQuantity=oSelectedItem.getBindingContext().getObject().availability
            
                                 if(oQuantity==oAvaiableQuantity){
                                    aISBNs.push(sISBN);
                                    oSelectedItem.getBindingContext().delete("$auto");
                                 }
                                 else{
                                    MessageToast.show("The Book was in Active loan")
                                    return
                                 }    
                                    
                                });
             
                                Promise.all(aISBNs.map(function (sISBN) {
                                    return new Promise(function (resolve, reject) {
                                        resolve( " Successfully Deleted");
                                    });
                                })).then(function (aMessages) {
                                    aMessages.forEach(function (sMessage) {
                                        MessageToast.show(sMessage);
                                    });
                                }).catch(function (oError) {
                                    MessageToast.show("Deletion Error: " + oError);
                                });
             
                                this.getView().byId("idBookTable").removeSelections(true);
                                this.getView().byId("idBookTable").getBinding("items").refresh();
                            } else {
                                MessageToast.show("Please Select Rows to Delete");
                            };
                        }
                    }
                })
                // if (aSelectedItems.length > 0) {
                //     var aISBNs = [];
                //     aSelectedItems.forEach(function (oSelectedItem) {
                //         var sISBN = oSelectedItem.getBindingContext().getObject().isbn;
                //         var oQuantity=oSelectedItem.getBindingContext().getObject().quantity
                //         var oAvaiableQuantity=oSelectedItem.getBindingContext().getObject().availability

                //      if(oQuantity==oAvaiableQuantity){
                //         aISBNs.push(sISBN);
                //         oSelectedItem.getBindingContext().delete("$auto");
                //      }
                //      else{
                //         MessageToast.show("The Book was in Active loan")
                //         return
                //      }    
                        
                //     });
 
                //     Promise.all(aISBNs.map(function (sISBN) {
                //         return new Promise(function (resolve, reject) {
                //             resolve( " Successfully Deleted");
                //         });
                //     })).then(function (aMessages) {
                //         aMessages.forEach(function (sMessage) {
                //             MessageToast.show(sMessage);
                //         });
                //     }).catch(function (oError) {
                //         MessageToast.show("Deletion Error: " + oError);
                //     });
 
                //     this.getView().byId("idBookTable").removeSelections(true);
                //     this.getView().byId("idBookTable").getBinding("items").refresh();
                // } else {
                //     MessageToast.show("Please Select Rows to Delete");
                // };
               
            },
            onCreate: async function () {
                var oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                    oPayload.availability=oPayload.quantity;
                    this.getView().getModel("localModel").setData(oPayload);
                    if (!(oPayload.ISBN && oPayload.author && oPayload.availability && oPayload.genre && oPayload.language  && oPayload.quantity && oPayload.title)) {
                        MessageToast.show("Enter all details");
                        return
                    }
    
                    try {
                        const oTitleExist = await this.checkTitle(oModel, oPayload.title, oPayload.ISBN)
                        if (oTitleExist) {
                            MessageToast.show("Book already exsist")
                            return
                        }
          
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBookTable").getBinding("items").refresh();
                    this.createDialog.close();
                } catch (error) {
                    this.createDialog.close();
                    MessageBox.error("some technical Issue")
                }
               
            },
            checkTitle: async function (oModel, stitle, sISBN) {
                return new Promise((resolve, reject) => {
                    oModel.read("/Books", {
                        filters: [
                            new Filter("title", FilterOperator.EQ, stitle),
                            new Filter("ISBN", FilterOperator.EQ, sISBN)

                        ],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                })
            },
            
            // onUpdateBtnPress: async function () {
            //     if (!this.updateDialog) {
            //         this.updateDialog = await this.loadFragment("updateBooks")
            //     }
            //     this.updateDialog.open();
            // },
            onCloseUpdateDialog: function () {
                if (this.updateDialog.isOpen()) {
                    this.updateDialog.close()
                }
            },
            onIssueBooksFilterPress: async function () {
                if (!this.issueBooksDialog) {
                    this.issueBooksDialog = await this.loadFragment("issueBooks")
                }
                this.issueBooksDialog.open();
            },
            onissuebookscancelbtn: function () {
                if (this.issueBooksDialog.isOpen()) {
                    this.issueBooksDialog.close()
                }
            },
            onActiveLoansFilterPress: async function () {
                if (!this.activeloansDialog) {
                    this.activeloansDialog = await this.loadFragment("activeLoans")
                }
                this.activeloansDialog.open();
            },
            onactiveloanscancelbtn: function () {
                if (this.activeloansDialog.isOpen()) {
                    this.activeloansDialog.close()
                }
            },
 
 
            onCloseloanpress: async function () {
                var aSelectedItems = this.byId("activeloansTable").getSelectedItems();
                var obj = this.byId("activeloansTable").getSelectedItem().getBindingContext().getObject(),
                oId=obj.book.ID,
                oAvaiable = obj.book.availability+1;
                const userModel = new sap.ui.model.json.JSONModel({
                   
                    book:{
                        availability:oAvaiable
                    }
 
                });
                this.getView().setModel(userModel, "userModel");
 
                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                    try{
                        oModel.update("/Books(" + oId + ")", oPayload.book, {
                            success: function() {
                                 this.getView().byId("idBooksTable").getBinding("items").refresh();//
                                //this.oEditBooksDialog.close();
                            },
                            error: function(oError) {
                                //this.oEditBooksDialog.close();
                                sap.m.MessageBox.error("Failed to update book: " + oError.message);
                            }.bind(this)
                        });
                    }catch (error) {
                        //this.oCreateBooksDialog.close();
                        sap.m.MessageBox.error("Some technical Issue");
                    }
    
                if (aSelectedItems.length > 0) {
                    var aISBNs = [];
                    aSelectedItems.forEach(function (oSelectedItem) {
                        var sISBN = oSelectedItem.getBindingContext().getObject().isbn;
                        aISBNs.push(sISBN);
                        oSelectedItem.getBindingContext().delete("$auto");
                    });
 
                    Promise.all(aISBNs.map(function (sISBN) {
                        return new Promise(function (resolve, reject) {
                            resolve("successfully your loan is closed");
                        });
                    })).then(function (aMessages) {
                        aMessages.forEach(function (sMessage) {
                            MessageToast.show(sMessage);
                        });
                    }).catch(function (oError) {
                        MessageToast.show("Deletion Error: " + oError);
                    });
 
                    //this.getView().byId("activeloansTable").removeSelections(true);
                    this.getView().byId("activeloansTable").getBinding("items").refresh();
                } else {
                    MessageToast.show("Please Select Rows to Delete");
                };
                //location.reload();
           

            },
            onUpdateBtnPress: async function () {
                var oSelected = this.byId("idBookTable").getSelectedItems();
            
                if (oSelected.length === 0) {
                    MessageToast.show("Please Select atleast one Book to Edit");
                    return
                }
             
                if (oSelected.length > 1) {
                    MessageToast.show("Please Select only one Book to Edit");
                    return
                }
                // var oSelect = oSelected
                if(oSelected){
                    var oID = oSelected[0].getBindingContext().getProperty("ID");
                    var oISBN = oSelected[0].getBindingContext().getProperty("ISBN");
                    var oTitle = oSelected[0].getBindingContext().getProperty("title");
                    this.oQuantity = oSelected[0].getBindingContext().getProperty("quantity");
                    var oAuthor = oSelected[0].getBindingContext().getProperty("author");
                    var oGenre = oSelected[0].getBindingContext().getProperty("genre");
                    var oLanguage = oSelected[0].getBindingContext().getProperty("language");
                    this.oAq = oSelected[0].getBindingContext().getProperty("availability");
                    
            
                    var newBookModel = new sap.ui.model.json.JSONModel({
                        ID:oID,
                        title: oTitle,
                        author: oAuthor,
                        quantity:this.oQuantity,
                        genre:oGenre,
                        ISBN:oISBN,
                        language:oLanguage,
                        availability:this.oAq
                    });
            
                    this.getView().setModel(newBookModel, "newBookModel");
                    if (!this.updateDialog) {
                        this.updateDialog = await this.loadFragment("updateBooks")
                    }
                    this.updateDialog.open();
                }
                
            },
            onUpdate: function() {
                console.log(this.oQuantity)
                console.log(this.oAq)   
                var oQ = parseInt(this.getView().byId("idQuantityInput").getValue());
                var oAq = parseInt(this.getView().byId("idavailabilityInput").getValue());
                if (this.oQuantity < oQ) {
                    oQ = oQ - this.oQuantity
                    oAq = oAq + oQ
                }
                else if (this.oQuantity > oQ) {
                    oQ = this.oQuantity - oQ
                    oAq = oAq - oQ
                }
                else {
                    oAq = oAq
                }
                console.log(oQ)
                var oPayload = this.getView().getModel("newBookModel").getData();
                oPayload.availability = oAq
                this.getView().getModel("newBookModel").setData(oPayload);
                var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model
                console.log(oDataModel.getMetadata().getName());

                try {

                    oDataModel.update("/Books(" + oPayload.ID + ")", oPayload, {
                        success: function() {
                            this.getView().byId("idBookTable").getBinding("items").refresh();
                            this.updateDialog.close();
                        }.bind(this),
                        error: function(oError) {
                            this.updateDialog.close();
                            sap.m.MessageBox.error("Failed to update book: " + oError.message);
                        }.bind(this)
                    });
                } catch (error) {
                    this.updateDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }
            
            
                var oDataModel = new sap.ui.model.odata.v2.ODataModel({
                    serviceUrl: "https://port4004-workspaces-ws-nhljh.us10.trial.applicationstudio.cloud.sap/v2/BooksSrv",
                    defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                    // Configure message parser
                    messageParser: sap.ui.model.odata.ODataMessageParser
                })  
        },
        onReservebtnpress:async function (oEvent) {
            console.log(this.byId("issuebooksTable").getSelectedItem().getBindingContext().getObject())
            // var oSelectedItem = oEvent.getSource().getParent();
            // console.log(oSelectedItem)
            // console.log(oEvent.getSource().getBindingContext().getObject())
            // console.log(oEvent.getParameters())
            // var oSelectedUser = oSelectedItem.getBindingContext().getObject();
            if(this.byId("issuebooksTable").getSelectedItems().length>1){
                MessageToast.show("Please Select only one Book");
                return
            }
            var oSelectedBook=this.byId("issuebooksTable").getSelectedItem().getBindingContext().getObject(),
            oAval=oSelectedBook.book.availability-1;
            console.log(oSelectedBook)
            var current=new Date();
            let due=new Date(current.getFullYear(),current.getMonth(),current.getDay()+18)
        
            const userModel = new sap.ui.model.json.JSONModel({
                book_ID : oSelectedBook.book.ID,
                user_ID: oSelectedBook.user.ID,
                issueDate: new Date(),
                dueDate:due,
                notify:
                `Your reserved book "
                ${oSelectedBook.book.title}
                " is issued`,
                book:{
                    availability:oAval
                }
            });
            this.getView().setModel(userModel, "userModel");
        
            const oPayload = this.getView().getModel("userModel").getProperty("/"),
                oModel = this.getView().getModel("ModelV2");
        
            try {
                await this.createData(oModel, oPayload, "/ActiveLoans");
                sap.m.MessageBox.success("your reserved Book is Accepted");
               
                this.byId("issuebooksTable").getSelectedItem().getBindingContext().delete("$auto");
                
                //this.getView().byId("idIssueBooks").getBinding("items").refresh();
                //this.oCreateBooksDialog.close();
                var oIssuebooksTable = this.byId("issuebooksTable");
                    var oSelectedItem = oIssuebooksTable.getSelectedItem();
                    oIssuebooksTable.removeItem(oSelectedItem);
                oModel.update("/Books(" + oSelectedBook.book.ID + ")", oPayload.book, {
                    success: function() {
                        // this.getView().byId("idBooksTable").getBinding("items").refresh();
                        //this.oEditBooksDialog.close();
                    },
                    error: function(oError) {
                        //this.oEditBooksDialog.close();
                        sap.m.MessageBox.error("Failed to update book: " + oError.message);
                    }.bind(this)
                });

            }
            
            
             catch (error) {
                //this.oCreateBooksDialog.close();
                sap.m.MessageBox.error("Some technical Issue");
            }
        },
        logout2:function(){
            var oRouter=this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHomePage",{},true)
        }
        
 
        });
    });