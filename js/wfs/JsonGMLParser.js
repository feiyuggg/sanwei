define(function ()
{
    "use strict";
    function JsonGMLParser(extractAttributes, xy, gmlnsm, wfsnsm, featureName, geometryAttribute) {
		this._extractAttributes = extractAttributes;
		this._featureName = featureName || "featureMember";
		this._xy = xy;
		this._gmlns = gmlnsm || "http://www.opengis.net/gml",
		this._wfs = wfsnsm || "http://www.opengis.net/wfs",
        this._geometryAttribute = geometryAttribute;

		// compile regular expressions once instead of every time they are used
		this._regExes = {
			trimSpace: (/^\s*|\s*$/g),
			removeSpace: (/\s*/g),
			splitSpace: (/\s+/),
			trimComma: (/\s*,\s*/g)
		};
	}

	Object.defineProperties(JsonGMLParser.prototype, {
		extractAttributes: {
			get: function() {
				return this._extractAttributes;
			},
			set: function(value) {
				this._extractAttributes = value;
			}
		},

		xy: {
			get: function() {
				return this._xy;
			},
		}
	});

	JsonGMLParser.prototype.read = function(data)
	{
		if(this._wfsPrefix == undefined)
		{
			this.detectPrefixes();
		}

		var documentElement = data["?xml"];
		if (documentElement == undefined)
		    documentElement = data[this._wfsPrefix + "FeatureCollection"];
		else
		    documentElement = data["?xml"][this._wfsPrefix + "FeatureCollection"];

		if(documentElement == undefined)
		{
			throw "Invalid GML format. Could not find root element"; 
		}

		var featureNodes = documentElement[this._gmlPrefix + this._featureName] || [];
		var features = [];
		var objName = this._featureName;

		if (featureNodes.length == undefined) {
		    var arr = Object.keys(featureNodes).map(function (key) { return {objName: featureNodes[key]}; });
		    featureNodes =  arr;
		}

        for(var i=0; i<featureNodes.length; i++) {
			var featureNode = featureNodes[i];
			var typeName = Object.getOwnPropertyNames(featureNode)[0];
            var feature = this.parseFeature(featureNode[typeName]);
            if(feature) {
                features.push(feature);
            }
        }
        return features;
    };
    
	JsonGMLParser.prototype.detectPrefixes = function(data)
	{
		this._wfsPrefix = "wfs:";
		this._gmlPrefix = "gml:";
	}	
	JsonGMLParser.prototype.detectGeometryAttribute = function(data)
	{
		this._geometryAttribute = "Geom";
	}	
    /**
     * Method: parseFeature
     * This function is the core of the GML parsing code in OpenLayers.
     *    It creates the geometries that are then attached to the returned
     *    feature, and calls parseAttributes() to get attribute data out.
     *    
     * Parameters:
     * node - {DOMElement} A GML feature node. 
     */

	function containGeometryAttribute(propName, geometryAttribute) {

	    var index = propName.indexOf(':' + geometryAttribute);
	    return (index > 0 && index == propName.length - geometryAttribute.length - 1);
	}

    JsonGMLParser.prototype.parseFeature = function(node) {
        // only accept one geometry per feature - look for highest "order"
        var order = ["MultiPolygon", "Polygon",
                     "MultiLineString", "LineString",
                     "MultiPoint", "Point"];
        // FIXME: In case we parse a feature with no geometry, but boundedBy an Envelope,
        // this code creates a geometry derived from the Envelope. This is not correct.
		if(this._geometryAttribute == null)
			this.detectGeometryAttribute(node);
		var geometry, type, parser;
		var attributes = {};
		for(var propName in node)
		{

		    if (propName == this._geometryAttribute || containGeometryAttribute(propName, this._geometryAttribute))
			{
				var fullType = Object.getOwnPropertyNames(node[propName])[0]
				type = fullType.replace(this._gmlPrefix,"");
				parser = this.parseGeometry[type.toLowerCase()];
				if(parser) {
					geometry = parser.apply(this, [node[propName][fullType]]);
				}
				else {
					console.log("unsupportedGeometryType:" + type);
                }
			}
			else if(propName != "_attributes")
			{
				attributes[propName] = node[propName].value;
			}
		}
		
		// TODO: optinally parse gml:boundedBy on feature
        var bounds;
		
        // construct feature (optionally with attributes)
        if(this.extractAttributes == false) {
            attributes = undefined;
        }
        var feature = 
		{
			geometryType: type.toLowerCase(),
			positions: geometry,
			attributes: attributes
		};
		
        feature.bounds = bounds;
                
        // assign fid - this can come from a "fid" or "id" attribute
        if (node["_attributes"]) {
            feature.fid = node["_attributes"].fid || node["_attributes"].id;
        }
        else {
            if (!feature.fid && feature.attributes && feature.attributes.FEATURE_ID)
                feature.fid = feature.attributes.FEATURE_ID;
        }

        return feature;
    };
    
    /**
     * Property: parseGeometry
     * Properties of this object are the functions that parse geometries based
     *     on their type.
     */
    JsonGMLParser.prototype.parseGeometry = {
        
        /**
         * Method: parseGeometry.point
         * Given a GML node representing a point geometry, create an OpenLayers
         *     point geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers_Geometry_Point>} A point geometry.
         */
        point: function(node) {
            /**
             * Three coordinate variations to consider:
             * 1) <gml:pos>x y z</gml:pos>
             * 2) <gml:coordinates>x, y, z</gml:coordinates>
             * 3) <gml:coord><gml:X>x</gml:X><gml:Y>y</gml:Y></gml:coord>
             */
            var nodeList, coordString;
            var coords = [];

            // look for <gml:pos>
			if(node[this._gmlPrefix + "pos"])
			{
				coordString = node[this._gmlPrefix + "pos"].value;
				coordString = coordString.replace(this._regExes.trimSpace, "");
				coords = coordString.split(this._regExes.splitSpace);
			}
            // look for <gml:coordinates>
            else if(node[this._gmlPrefix + "coordinates"])
			{
				coordString = node[this._gmlPrefix + "coordinates"].value;
				coordString = coordString.replace(this._regExes.removeSpace,"");
				coords = coordString.split(",");
            }

            // look for <gml:coord>
            else if(node[this._gmlPrefix + "coord"]) 
			{
				var xVal = node[this._gmlPrefix + "coord"][this._gmlPrefix + "X"].value;
				var yVal = node[this._gmlPrefix + "coord"][this._gmlPrefix + "Y"].value;
				if(xVal != undefined && yVal != undefined) {
					coords = [xVal,yVal];
				}                
            }
                
            // preserve third dimension
            if(coords.length == 2) {
                coords[2] = null;
            }
            
            if (this.xy) {
                return [parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])];
            }
            else{
                return [parseFloat(coords[1]), parseFloat(coords[0]), parseFloat(coords[2])];
            }
        },
        
        /**
         * Method: parseGeometry.multipoint
         * Given a GML node representing a multipoint geometry, create an
         *     OpenLayers multipoint geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiPoint>} A multipoint geometry.
         */
        multipoint: function(node) {
            var nodeList = node[this._gmlPrefix + "pointMember"];
            var components = [];

            if (nodeList.length == undefined)
                nodeList = [nodeList];            

            if(nodeList.length > 0) {
                var point;
                for(var i=0; i<nodeList.length; ++i) {
                    point = this.parseGeometry.point.apply(this, [nodeList[i][this._gmlPrefix + "Point"]]);
                    if(point) {
                        components.push(point);
                    }
                }
            }
            return components;
        },
        
        /**
         * Method: parseGeometry.linestring
         * Given a GML node representing a linestring geometry, create an
         *     OpenLayers linestring geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.LineString>} A linestring geometry.
         */
        linestring: function(node) {
            /**
             * Two coordinate variations to consider:
             * 1) <gml:posList dimension="d">x0 y0 z0 x1 y1 z1</gml:posList>
             * 2) <gml:coordinates>x0, y0, z0 x1, y1, z1</gml:coordinates>
             */
            var nodeList, coordString;
            var coords = [];
            var points = [];

            // look for <gml:posList>
            if(node[this._gmlPrefix + "posList"]) {
                coordString = node[this._gmlPrefix + "posList"].value;
                coordString = coordString.replace(this._regExes.trimSpace, "");
                coords = coordString.split(this._regExes.splitSpace);
                var dim = node[this._gmlPrefix + "posList"]._attributes["dimension"];
                var j, x, y, z;
                for(var i=0; i<coords.length/dim; ++i) {
                    j = i * dim;
                    x = parseFloat(coords[j]);
                    y = parseFloat(coords[j+1]);
                    z = (dim == 2) ? null : parseFloat(coords[j+2]);
                    if (this.xy) {
                        points.push( x, y, z);
                    } else {
                        points.push(y, x, z);
                    }
                }
            }

            // look for <gml:coordinates>
            else if(node[this._gmlPrefix + "coordinates"]) {
				coordString = node[this._gmlPrefix + "coordinates"].value;
				coordString = coordString.replace(this._regExes.trimSpace,"");
				coordString = coordString.replace(this._regExes.trimComma,",");
				var pointList = coordString.split(this._regExes.splitSpace);
				for(var i=0; i<pointList.length; ++i) {
					coords = pointList[i].split(",");
					if(coords.length == 2) {
						coords[2] = null;
					}
					if (this.xy) {
						points.push(parseFloat(coords[0]),
											  parseFloat(coords[1]),
											  parseFloat(coords[2]));
					} else {
						points.push(parseFloat(coords[1]),
												  parseFloat(coords[0]),
												  parseFloat(coords[2]));
					}
				}                
            }
			
			return points;
        },
        
        /**
         * Method: parseGeometry.multilinestring
         * Given a GML node representing a multilinestring geometry, create an
         *     OpenLayers multilinestring geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers.Geometry.MultiLineString>} A multilinestring geometry.
         */
        multilinestring: function(node) {
            var nodeList = node[this._gmlPrefix + "lineStringMember"];
            var components = [];

            if (nodeList.length == undefined)
                nodeList = [nodeList];

            if(nodeList.length > 0) {
                var line;
                for(var i=0; i<nodeList.length; ++i) {
                    line = this.parseGeometry.linestring.apply(this,[nodeList[i][this._gmlPrefix + "LineString"]]);
                    if(line) {
                        components.push(line);
                    }
                }
            }
            return components;
        },
        
        /**
         * Method: parseGeometry.polygon
         * Given a GML node representing a polygon geometry, create an
         *     OpenLayers polygon geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers_Geometry_Polygon>} A polygon geometry.
         */
        polygon: function(node) {
			var rings = [node[this._gmlPrefix + "outerBoundaryIs"][this._gmlPrefix + "LinearRing"]];
			if(node[this._gmlPrefix + "innerBoundaryIs"])
			{
                //if array format
                if (node[this._gmlPrefix + "innerBoundaryIs"].length!==undefined){
                    for(var i=0;i<node[this._gmlPrefix + "innerBoundaryIs"].length;i++)
                        rings.push(node[this._gmlPrefix + "innerBoundaryIs"][i][this._gmlPrefix + "LinearRing"]);
                }else{ //if object format
                    for(var i=0;i<Object.keys(node[this._gmlPrefix + "innerBoundaryIs"]).length;i++){
                        if (Object.keys(node["gml:innerBoundaryIs"])[i] === this._gmlPrefix + "LinearRing" )
                            rings.push(Object.values(node[this._gmlPrefix + "innerBoundaryIs"])[i]);
                    }
                }
			}
            var components = [];
            if(rings.length > 0) {
                // this assumes exterior ring first, inner rings after
                var ring;
                for(var i=0; i<rings.length; ++i) {
                    ring = this.parseGeometry.linestring.apply(this,[rings[i]]);
                    if(ring) {
                        components.push(ring);
                    }
                }
            }
            return components;
        },
        
        /**
         * Method: parseGeometry.multipolygon
         * Given a GML node representing a multipolygon geometry, create an
         *     OpenLayers multipolygon geometry.
         *
         * Parameters:
         * node - {DOMElement} A GML node.
         *
         * Returns:
         * {<OpenLayers_Geometry_MultiPolygon>} A multipolygon geometry.
         */
        multipolygon: function(node) {
            var nodeList = node[this._gmlPrefix + "polygonMember"];
            var components = [];

            if (nodeList.length == undefined)
                nodeList = [nodeList];

            if(nodeList.length > 0) {
                var polygon;
                for(var i=0; i<nodeList.length; ++i) {
                    polygon = this.parseGeometry.polygon.apply(this,[nodeList[i][this._gmlPrefix + "Polygon"]]);
                    if(polygon) {
                        components.push(polygon);
                    }
                }
            }
            return components;
        },        
    };
	
	return JsonGMLParser;
});