var MyToolWithDialog = function () {

    //SET TOOL ID    
    this.getId = function () {
        return 'MyToolWithDialog';
    },

        //SET MENU ENTRY FOR THE TOOL (See example 1 for more details)
        this.getMenuEntry = function () {
            return TerraExplorer.tools.MenuEntry.addToSidebar(this, "My Tool with Dialog", "./userTools/myToolIcon.png", 2, TerraExplorer.tools.MenuEntry.MenuEntryAnalysis(), "My Tools");
        },

        //SET CODE TO EXECUTE WHEN TOOL IS CLICKED IN SIDEBAR
        this.open = function () {
            //CREATE A DIV ELEMENT
            var $div = $("<div style='position:absolute; overflow:hidden; width:400px; height:100px;'>Hello Dialog Tool</div>");

            //OPEN THE DIALOG BOX
            //Use the ToolDialog.open function to open the dialog box.
            //ToolDialog.open(name, icon, divElement)
            //name – Dialog box title.
            //myDialogIcon – Path to an icon image file that will show next to the dialog box title
            //divElement - div element containing the dialog content
            TerraExplorer.tools.ToolDialog.open("My Tool Dialog", "./userTools/myDialogIcon.png", $div.get(0));
            return true;
        }
};
