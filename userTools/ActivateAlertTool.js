var ActivateAlertTool = function () {

    //SET TOOL ID    
    this.getId = function () {
        return 'ActivateAlertTool';
    },

        //SET MENU ENTRY FOR THE TOOL
        this.getMenuEntry = function () {
            // Use the addToSidebar function to set the tool’s appearance in the sidebar. The sidebar menu shows a collection of menu entries from all standard and custom TE4W tools, organized under four main tabs. Custom tools can be placed either under the Navigate or the Analysis tab. 
            // addToSidebar(tool, name, icon, order, parent, group)
            //tool - Always pass "this".
            //name – Tool name in the sidebar menu.
            //icon - Path to an icon image file that will display next to the tool name in the application’s TE4W’s sidebar menu (24*24 pixels).
            //order - Position of the tool in the sidebar menu.
            //parent - Sidebar menu tab the new tool should be placed under. The available options are: ‘TerraExplorer.tools.MenuEntry.MenuEntryNavigate()’(Navigate tab) or ‘TerraExplorer.tools.MenuEntry.MenuEntryAnalysis()’(Analysis tab).
            //group - Header for the section under which the tool should be included in the sidebar menu.
            return TerraExplorer.tools.MenuEntry.addToSidebar(this, "My Alert Tool", "./userTools/myToolIcon.png", 1, TerraExplorer.tools.MenuEntry.MenuEntryAnalysis(), "My Tools");
        },

        //SET CODE TO EXECUTE WHEN TOOL IS CLICKED IN SIDEBAR
        this.open = function () {
            alert("Alert: Hello TE4W");
            return true;
        }
};
