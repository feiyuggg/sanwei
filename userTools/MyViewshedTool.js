var MyViewshedTool = function () {

    //SET TOOL ID    
    this.getId = function () {
        return 'MyViewshedTool';
    },

        //SET MENU ENTRY FOR THE TOOL (See example 1 for more details)
        this.getMenuEntry = function () {
            return TerraExplorer.tools.MenuEntry.addToSidebar(this, "My Viewshed Tool", "./userTools/myToolIcon.png", 3, TerraExplorer.tools.MenuEntry.MenuEntryAnalysis(), "My Tools");
        },

        //SET CODE TO EXECUTE WHEN TOOL IS CLICKED IN SIDEBAR
        this.open = function () {
            //CREATE A MESH LAYER USING THE CreateMeshLayer METHOD 
            var promise = TerraExplorer.SGWorld.Creator.CreateMeshLayer("Frederick", "http://www.SkylineGlobe.com/SG/streamer.ashx", "Frederick_4TEDF", true);
            promise.then(function (teObject) {
                //PRINT DESCRIPTION OF ADDED LAYER
                console.log("Created Mesh layer: " + teObject.description);
                //FLY TO Frederick USING THE camera.flyTo METHOD 
                viewer.camera.flyTo({
                    destination: new Cesium.Cartesian3.fromDegrees(-77.40982, 39.41875, 600), //Frederick coordinates
                    orientation: {
                        heading: Cesium.Math.toRadians(180.0),
                        pitch: Cesium.Math.toRadians(-55.0),
                        roll: 0.0
                    },
                    complete: function () {
                        var hpra = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(90.0), -45, 2000);
                        var vsPositionCarto = new Cesium.Cartesian3.fromDegrees(-77.41319, 39.41702, 300); //Other Frederick coordinates
                        //CREATE VIEWSHED OBJECT USING THE CreateViewshedObject METHOD 
                        TerraExplorer.SGWorld.Analysis.CreateViewshedObject('Viewshed On Frederick', vsPositionCarto, 53, 53, hpra, { roll: 0.0 });
                    }
                });
            }).otherwise(function (err) {
                alert(err);
            });

            return true;
        }
};
