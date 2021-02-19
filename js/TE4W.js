// get some kind of XMLHttpRequest
var xhrObj = new XMLHttpRequest();
// open and send a synchronous request
xhrObj.open('GET', "./js/jquery.js", false);
xhrObj.send('');
// add the returned content to a newly created script tag
var se = document.createElement('script');
se.type = "text/javascript";
se.text = xhrObj.responseText;
document.getElementsByTagName('head')[0].appendChild(se);

var startTerraExplorer4Web = function(divId, SGUrl, cb, options) {

	options = $.extend(true, {}, options);

	$("#" + divId).css("visibility", "hidden");
	$("#" + divId).css("position", "relative");
	$("#" + divId).css("margin", "0");
	$("#" + divId).css("overflow", "hidden");
	$("#" + divId).css("padding", "0");

	var cesiumDivContainer = document.createElement("div");
	cesiumDivContainer.setAttribute("id", "cesiumContainer");
	cesiumDivContainer.style.width = document.getElementById(divId).style.width;
	cesiumDivContainer.style.height = document.getElementById(divId).style.height;
	document.getElementById(divId).appendChild(cesiumDivContainer);

	var creditDiv = document.createElement("div");
	creditDiv.setAttribute("class", "s8");
	creditDiv.setAttribute("id", "creditDiv");
	document.body.appendChild(creditDiv);

	window.SGUrl = SGUrl;
	window.divId = divId;
	window.isTELoading = true;

	$("head").append(
		'<link rel="stylesheet" type="text/css" href="./css/mainStyle.css?srcVer=7.2.1.4239">'
	);

	$("head").append(
		'<link rel="shortcut icon" href="img/Icon.ico" type="image/x-icon" />'
	);
	$("head").append(
		'<link rel="icon" href="img/Icon.ico" type="image/x-icon" />'
	);
	startAfterScripts();

	function startAfterScripts() {
		// console.log('afterScripts');

		var browser = {};

		if (detectBrowser(browser)) startLoadingTE4Web();

		function detectBrowser(browser) {
			if (browser == undefined) browser = {};

			// Opera 8.0+
			browser.isOpera =
				(!!window.opr && !!opr.addons) ||
				!!window.opera ||
				navigator.userAgent.indexOf(" OPR/") >= 0;
			// Firefox 1.0+
			browser.isFirefox = typeof InstallTrigger !== "undefined";
			// At least Safari 3+: "[object HTMLElementConstructor]"
			browser.isSafari =
				Object.prototype.toString
				.call(window.HTMLElement)
				.indexOf("Constructor") > 0;
			// Internet Explorer 6-11
			browser.isIE = /*@cc_on!@*/ false || !!document.documentMode;
			// Edge 20+
			browser.isEdge = !browser.isIE && !!window.StyleMedia;
			// Chrome 1+
			browser.isChrome = !!window.chrome && !!window.chrome.webstore;
			// Blink engine detection
			browser.isBlink = (browser.isChrome || browser.isOpera) && !!window.CSS;

			//if (browser.isIE) {
			//    var errorMsg = $("<p id='err' style='position:absolute; float:left; width:420px; font-family: helvetica;'>TerraExplorer for Web is presently supported on the latest versions of Chrome, Safari, Firefox and Edge.<br><br>We're sorry but Internet Explorer is not currently supported.</p>");
			//        $('#loadingDiv').css({ 'top': '40%', 'left': '35%' }).html(errorMsg);

			//        return false;
			//}

			return true;
		}

		function getScriptAsync(source) {
			return new Promise(function(resolve, reject) {
				var js_script = document.createElement("script");
				js_script.type = "text/javascript";
				js_script.src = source;
				document.getElementsByTagName("head")[0].appendChild(js_script);
				js_script.onload = function() {
					resolve();
				};
			});
		}

		function getScriptAsyncEx(url, onSuccess, onError) {
			if (!browser.isIE) {
				//use promise

				var cesiumPromise = getScriptAsync(url);
				cesiumPromise.then(onSuccess).catch(onError);
			} else {
				//use callback
				var js_script = document.createElement("script");
				js_script.type = "text/javascript";
				js_script.src = url;
				js_script.onload = function() {
					try {
						onSuccess();
					} catch (e) {
						onError(e);
					}
				};
				js_script.onerror = onError;
				document.getElementsByTagName("head")[0].appendChild(js_script);
			}
		}

		function loadCesiumRelease(onSucess) {
			getScriptAsyncEx(
				"./cesium/Build/Cesium/Cesium.js?srcVer=7.2.1.4239",
				onSucess,
				function(e) {
					$("#loadingDiv").html("Error: " + e.message);
				}
			);
		}

		function loadCesiumUnminifiedRelease(onSucess) {
			getScriptAsyncEx(
				"./cesium/Build/CesiumUnminified/Cesium.js?srcVer=7.2.1.4239",
				onSucess,
				function(e) {
					$("#loadingDiv").html("Error: " + e.message);
				}
			);
		}

		function loadCesiumDebug(onSucess) {
			require(["../cesium/Source/Cesium"], function(Cesium) {
				var scope =
					typeof window !== "undefined" ?
					window :
					typeof self !== "undefined" ?
					self : {};
				scope.Cesium = Cesium;
				onSucess();
			});
		}

		function loadTERelease(onSucess) {
			getScriptAsyncEx(
				"./js/TerraExplorer-7.0.min.js?srcVer=7.2.1.4239",
				onSucess,
				function(e) {
					$("#loadingDiv").html("Error: " + e.message);
				}
			);
		}

		function loadTEDebug(onSucess) {
			onSucess();
		}

		function startLoadingTE4WebDebug() {
			loadCesiumDebug(function() {
				loadTEDebug(initialize);
			});
		}

		function startLoadingTE4Web() {
			loadCesiumRelease(function() {
				loadTERelease(initialize);
			});
		}

		var viewer;
		var baseKml;
		var baseKmlUrl;
		var layoutKml;
		var terrainData;
		var projectUrl; // either kml or other project url
		var catalogId = options.catalogId; //take from API if exists
		var kmlLayoutUrl = options.config; //take from API if exists
		var domains;
		var position;
		var foreignKmlUrl;
		var vrButton = false;
		var canContinueFromSplash = true;

		var splashMessagesTypes = {
			UNSECURED_SERVER_TERRAIN: "Terrain database from non-secured (HTTP) servers cannot be read <br/> by TerraExplorer for Web when running as a secured website (HTTPS)",
			NO_PERMISSION_KML: "You do not have permission to read this KML",
			NO_PERMISSION_TERRAIN: "You do not have permission to use this terrain",
			KML_NOT_FOUND: "Kml could not be found",
			KML_MUST_CONTAIN_TERRAIN_TAG: "Default kml must contain a Terrain tag",
			CONFIG_KML_NOT_FOUND: "Configuration file not found",
			LICENSE_INVALID: "The SkylineGlobe Server license for this TerraExplorer for Web has expired. Contact the site administrator for further assistance.",
			INVALID_KML: 'Cannot load TerraExplorer for Web : Invalid KML'
		};

		function isProtocolHTTPS(url) {
			var protocol = url.slice(0, 5);
			if (protocol == "https") return true;
			//http:
			else return false;
		}

		function showProgress(progressStep) {
			$("#stepId").html(progressStep);
		}

		function showErrorOnSplashScreen(splashScreenMessage) {
			showProgress("");
			canContinueFromSplash = false;
			var left = 50 - splashScreenMessage.length / 2 + "%";
			if (splashScreenMessage === splashMessagesTypes.UNSECURED_SERVER_TERRAIN)
				left = "25%";
			$("#loadingDiv").html("Error : " + splashScreenMessage);
			$("#loadingDiv").css({
				"font-size": "22px",
				left: left
			});
			throw new Error(splashScreenMessage);
		}

		function getUrlParameters() {
			//query string ex: http://asher/terraExplorerWeb/TerraExplorer.html?project=default.kml&config=config.kml&
			var vars = [],
				hash;
			var preHashes = window.location.href.replace(/%20/g, ""); //remove spaces
			var hashes = preHashes
				.slice(window.location.href.indexOf("?") + 1)
				.split("&");

			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split("=");
				if (hash.length == 3 && hash[0] == "kmlUrl") hash[1] += "=" + hash[2];
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}

			return vars;
		}

		function initialize() {
			try {
				//if (browser.isIE)
				//    return;

				// The following relies on TerraExplorerWeb in the path which may not be always the case...
				// var match = window.location.href.match(/(.+\/([^/]+))\/TerraExplorerWeb/i);
				// var urlPrefix = match[1];
				// var SGVirtualPath = match[2];
				var urlPrefix;
				if (window.SGUrl === undefined) {
					// Find the SG between the starting '/' and '/'. This can be different than /SG/ (e.g. it can be /SG710/)
					var SGVirtualPath =
						window.location.pathname.indexOf("/") == 0 ?
						window.location.pathname.substring(1) :
						window.location.pathname;
					SGVirtualPath = SGVirtualPath.substring(
						0,
						SGVirtualPath.indexOf("/")
					);

					urlPrefix =
						window.location.origin + "/" + SGVirtualPath + getCurrentSitePath();
				} else {
					urlPrefix = window.SGUrl;
				}

				projectUrl = getUrlParameters()["project"];
				mobileApp = getUrlParameters()["mobileApp"];

				if (kmlLayoutUrl === undefined)
					//if not passed from API
					kmlLayoutUrl = getUrlParameters()["config"] || "config.kml";
				position = getUrlParameters()["position"] || 0;

				if (catalogId === undefined)
					//if not passed from API
					catalogId = getUrlParameters()["catalogid"];
				foreignKmlUrl = getUrlParameters()["kmlUrl"];
				vrButton = getUrlParameters()["vrb"] > 0;

				if (catalogId != undefined && catalogId != "") {
					catalogId = urlPrefix + "/projects?id=" + catalogId;
				}

				function FixFFString(str) {
					// FireFox is more sensitive to XML "not well formed" + FF does not recognize BOM in the returned string
					if (browser.isFirefox && str.indexOf("\ufffd\ufffd") == 0) {
						return str.slice(2).replace(/\0/g, "");
					}

					return str;
				}

				var that = this;

				// Load Layout kml

				var msgCannotRetrieveDefaultConfigFile =
					"Could not retrieve default configuration";

				function setDefaultLayoutKml() {
					$.ajax({
						type: "GET",
						cache: false,
						url: urlPrefix + "/getconfigfile",
						success: function(data) {
							if (data.Value != undefined) layoutKml = data.Value;
							else {
								if (data.indexOf("License Invalid") > -1) layoutKml = "lic";
								console.error(msgCannotRetrieveDefaultConfigFile);
							}
						},
						error: function(reason) {
							console.error(msgCannotRetrieveDefaultConfigFile);
						},
						async: false
					});
					// console.log('fallback to default configuration');
				}

				if (kmlLayoutUrl.indexOf(".kml") > -1)
					kmlLayoutUrl = kmlLayoutUrl.replace(".kml", "");

				$.ajax({
					type: "POST",
					url: urlPrefix + "/getconfigfile?name=" + kmlLayoutUrl,
					xhrFields: {
						withCredentials: true
					},
					cache: false,
					contentType: "application/json",
					success: function(data) {
						try {
							if (data.Value != undefined) layoutKml = data.Value;
							else setDefaultLayoutKml();
						} catch (e) {
							setDefaultLayoutKml();
						}
					},
					error: function(e) {
						setDefaultLayoutKml();
					},
					async: false
				});

				if (layoutKml == undefined) {
					showErrorOnSplashScreen(splashMessagesTypes.CONFIG_KML_NOT_FOUND);
					return;
				}

				if (layoutKml == "lic") {
					showErrorOnSplashScreen(splashMessagesTypes.LICENSE_INVALID);
					return;
				}

				var ignoreBaseImageryTag = $(layoutKml).find("ignorebaseimagery");
				var ignoreBaseImagery = "false";
				if (ignoreBaseImageryTag.length > 0) {
					ignoreBaseImagery = $(ignoreBaseImageryTag[0]).text();
				}
				var noPermsForBaseKml = false;

				var loadBaseKmlProcess = function() {
					// mutually exclusive - catalogId before project
					if (catalogId == undefined) {
						var expUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
						if (projectUrl != undefined && projectUrl != "") {
							if (projectUrl.search(/.kml/) != -1)
								projectUrl = Cesium.defaultValue(projectUrl, "default.kml");
							else if (projectUrl.indexOf(".") != -1) {
								var stringAfterLastDot = projectUrl.substring(
									projectUrl.lastIndexOf(".") + 1
								);
								if (!isNaN(stringAfterLastDot))
									projectUrl =
									"http://www.skylineglobe.com/SG/projects?id=" + projectUrl;
								else projectUrl = "default.kml";
							} else if (projectUrl.search(expUrl) != -1)
								window.location = projectUrl;
							else projectUrl = "default.kml";
						}
					}

					function loadBaseKml(urlBaseKML) {
						$.ajax({
							url: urlBaseKML,
							success: function(kml) {
								if (typeof kml == "string") {
									kml = FixFFString(kml);
									if (kml.indexOf("xmlns:gx") != -1) {
										baseKml = $.parseXML(kml);
										baseKmlUrl = urlBaseKML;
									} else console.error("Not a valid google-earth string");
								} else {
									baseKml = kml;
									baseKmlUrl = urlBaseKML;
								}
							},
							error: function(e, x) {
								if (
									e &&
									e.responseJSON &&
									e.responseJSON.resultMessageCode == "NoPermissions"
								) {
									noPermsForBaseKml = true; // causing 'force login'
								}
							},
							async: false
						});
					}

					// Load base kml

					if (catalogId != undefined) {
						loadBaseKml(catalogId);
					} else if (projectUrl != undefined) {
						loadBaseKml(projectUrl);
					} else {
						// We first try to load project that has id=defaultWebProject. This way, we can create an alias for existing project with the name of "defaultWebProject" and it will be loaded as the default KML.
						// If such layer does not exist, it will load the "hard coded" default.kml file from the TerraExplorerWeb directory.
						var defaultWebProject =
							urlPrefix + "/projects?id=defaultWebProject";
						loadBaseKml(defaultWebProject);
						if (baseKml == undefined) loadBaseKml("default.kml");
					}
				};

				var noPermsForBaseTerrain = false;

				var loadBaseTerrainProcess = function() {
					if (baseKml == undefined) return; // cannot load terrain without having kml
					domains = getDomains(layoutKml);
					setTrustedServers(domains); // OmerLG SGS-1369 (see the function description)
					terrainData = getTerrainDataFromKML(baseKml);

					if (
						terrainData.terrainImageryLayerName == undefined ||
						terrainData.terrainImageryUrl == undefined
					) {
						terrainData.terrainImageryLayerName = terrainData.terrainImagery;
						terrainData.terrainImageryUrl = terrainData.terrainUrl;
						terrainData.terrainSubdomainsImagery =
							terrainData.terrainSubdomains;
					}

					var checkTerrainPermissionUrl =
						terrainData.terrainSubdomainsImagery != undefined &&
						terrainData.terrainSubdomainsImagery.length > 0 ?
						terrainData.terrainSubdomainsImagery[0] +
						"/" +
						terrainData.SGVirtualPath +
						"/Imagery" :
						terrainData.terrainImageryUrl;

					$.ajax({
						method: "GET",
						url: checkTerrainPermissionUrl +
							"?service=WMS&version=1.1.1&request=GetMap&styles=&format=image%2Fjpeg&layers=" +
							terrainData.terrainImageryLayerName +
							"&srs=EPSG%3A4326&bbox=-180%2C0%2C-135%2C45&width=256&height=256",
						cache: false,
						success: function(data) {
							noPermsForBaseTerrain = data.length == 0;
						},
						error: function(e) {
							if (
								isProtocolHTTPS(window.location.protocol) &&
								!isProtocolHTTPS(checkTerrainPermissionUrl)
							) {
								showErrorOnSplashScreen(
									splashMessagesTypes.UNSECURED_SERVER_TERRAIN
								);
							} else {
								noPermsForBaseTerrain = true;
							}
						},
						async: false
					});
				};

				var restOfInitializing = function() {
					showProgress("正在加载地形...");

					// handle base kml
					if (baseKml == undefined) {
						// load again if nessaccery (after login process)
						loadBaseKmlProcess(); // load again if nessaccery (after login process)
						loadBaseTerrainProcess();

						// At this point we must have a base kml otherwise we will not be able to initialize Cesium with the base terrain.
						if (baseKml == undefined)
							showErrorOnSplashScreen(splashMessagesTypes.NO_PERMISSION_KML);
					} else {
						// handle base terrain
						if (noPermsForBaseTerrain) loadBaseTerrainProcess(); // load again if nessaccery (after login process)
						// check permissions again for terrain
						if (noPermsForBaseTerrain)
							showErrorOnSplashScreen(
								splashMessagesTypes.NO_PERMISSION_TERRAIN
							);
					}

					if (terrainData.terrainImageryUrl === undefined) return;

					window.viewer = viewer = new Cesium.Viewer("cesiumContainer", {
						imageryProvider: new Cesium.WebMapServiceImageryProvider({
							url: terrainData.terrainImageryUrl,
							subdomains: terrainData.terrainSubdomainsImagery,
							layers: terrainData.terrainImageryLayerName,
							enablePickFeatures: false
						}),
						animation: false,
						scene3DOnly: true,
						baseLayerPicker: false,
						fullscreenButton: false,
						geocoder: false,
						shouldAnimate: true,
						homeButton: false,
						infoBox: false,
						sceneModePicker: false,
						selectionIndicator: false,
						timeline: false,
						navigationHelpButton: false,
						creditContainer: "creditDiv",
						contextOptions: {
							failIfMajorPerformanceCaveat: false
						},
						useDefaultRenderLoop: false,
						vrButton: vrButton
					});

					viewer.ignoreBaseImagery = ignoreBaseImagery;

					$("#creditDiv").remove();

					// Do TerraExplorer initialization related stuff inside initTE()

					initTE();
				};

				loadBaseKmlProcess();
				loadBaseTerrainProcess();
				sgAccount.TE4WLogin(
					layoutKml,
					restOfInitializing,
					noPermsForBaseKml ||
					noPermsForBaseTerrain /* which means 'force login' */
				);
			} catch (e) {
				if (e.message.toLowerCase().indexOf('invalid xml') > -1) {
					$('#loadingDiv').html(splashMessagesTypes.INVALID_KML);
					showProgress('');
				}

				// FIXME: call here onError callback (not exist yet)
			}
		}

		// OmerLG SGS-1369: I added this function in order to make sure that all the sub-domains are registered.
		//                  The sub-domains mechanism is too complecated to fix it days before the release (v7.2.1). 
		function setTrustedServers(domains) {

			if (!domains)
				return;

			for (var i = 0; i < domains.length; i++) {

				var item = domains[i];
				if (!item)
					continue;

				var match = item.match(/^\s*(http|https):\/\/([^\/]+)/i);
				if (match)
					Cesium.TrustedServers.add(match[2], match[1] == 'http' ? 80 : 443);
			}
		}

		function initTEDebug() {
			require(["TerraExplorer"], function(TerraExplorer) {
				var scope =
					typeof window !== "undefined" ?
					window :
					typeof self !== "undefined" ?
					self : {};
				scope.TerraExplorer = TerraExplorer;
				initTE();
			});
		}

		showProgress("系统初始化...");

		function initTE() {
			TerraExplorer.init();

			//////////////////////////////////////////////////////////d
			// Set the terrain provider

			if (
				terrainData.terrainElevationLayerName == undefined ||
				terrainData.terrainElevationUrl == undefined
			) {
				terrainData.terrainElevationLayerName = terrainData.terrainElevation;
				terrainData.terrainElevationUrl = terrainData.terrainUrl;
				terrainData.terrainSubdomainsElevation = terrainData.terrainSubdomains;
			}

			var useSFSTerrainProvider = true;

			function setUpTerrain(viewer) {
				var terrainProvider = new TerraExplorer.internal.SFSTerrainProvider({
					url: terrainData.terrainElevationUrl,
					layerName: terrainData.terrainElevationLayerName,
					subdomains: terrainData.terrainSubdomainsElevation,
					requestVertexNormals: true
				});
				viewer.terrainProvider = terrainProvider;

				TerraExplorer.internal.Units.init();
			}

			setUpTerrain(viewer);

			viewer.useDefaultRenderLoop = true;

			showProgress("加载工具...");
			////////////////////////////////////////////////////////////
			//// Add User's Tools
			var scope =
				typeof window !== "undefined" ?
				window :
				typeof self !== "undefined" ?
				self : {};
			var userToolsUrl = "js/userTools.js?srcVer=7.2.1.4239";
			$.ajax({
				url: userToolsUrl,
				dataType: "script",
				async: false,
				success: function() {
					TerraExplorer.tools.userTools.forEach(function(toolName) {
						scope.name = !(toolName instanceof String) ?
							toolName.toString() :
							toolName;
						$.ajax({
							url: "userTools/" + name + ".js?srcVer=7.2.1.4239",
							dataType: "script",
							async: false,
							success: function() {
								var userTool = new scope[scope.name]();
								TerraExplorer.tools.ToolManager.registerTool(userTool);
							},
							error: function(e) {
								console.log(e.message);
							}
						});
					});
				},
				error: function(e) {
					console.log(e.message);
				}
			});
			////////////////////////////////////////////////////////////

			// Read the base KML. This kml should also contain special sx: tags that specify TE layout and layers

			var KmlURL = catalogId == undefined ? projectUrl : catalogId;
			if (KmlURL == undefined) {
				if (foreignKmlUrl != undefined) KmlURL = foreignKmlUrl;
				else KmlURL = baseKmlUrl;
			}
			TerraExplorer.internal.Project.readLayout(layoutKml);
			showProgress("正在加载场景...");
			TerraExplorer.internal.Project.load(KmlURL, onProjectLoaded, terrainData); // url

			if (viewer.vrButton) addVrButtonHandler();
		}

		function addVrButtonHandler() {
			TerraExplorer.allowVR = true;
			viewer.vrButton.viewModel.command.beforeExecute.addEventListener(function(
					args
				) {
					if (
						TerraExplorer.allowVR === true &&
						!viewer.vrButton.viewModel.isVRMode
					) {
						TerraExplorer.tools.SideBar.Hide();
						args.cancel = true;
						setTimeout(function() {
							TerraExplorer.allowVR = false;
							$(viewer.vrButton.container)
								.find("button")
								.click();
						}, 300);
					}

					TerraExplorer.allowVR = true;
				},
				this);
		}

		function getTerrainDataFromKML(baseKml) {
			if (baseKml == undefined)
				showErrorOnSplashScreen(splashMessagesTypes.NO_PERMISSION_KML);

			var t = {};

			var $terrain = $(baseKml).find("sx\\:Terrain, Terrain");
			if ($terrain.length == 0) {
				showErrorOnSplashScreen(
					splashMessagesTypes.KML_MUST_CONTAIN_TERRAIN_TAG
				);
				return t;
			}

			//new Kml terrain tag

			var $rasterTag = $terrain.find("sx\\:RasterLayer,RasterLayer");
			if ($rasterTag.length == 2) {
				var $ImageryLayerName;
				var $ElevationLayerName;
				var $ImageryHref;
				var $ElevationHref;

				$($rasterTag).each(function(index, value) {
					var isElevation = $(value)
						.find("sx\\:elevation,elevation")
						.text();
					var href = $(value)
						.find("href")
						.text();
					var layerName = $(value)
						.find("sx\\:layerName,layerName")
						.text();

					if (isElevation == "0") {
						$ImageryLayerName = layerName;
						$ImageryHref = href;
					} else if (isElevation == "1") {
						$ElevationHref = href;
						$ElevationLayerName = layerName;
					} else console.error("invalid elevation value!");
				});

				t.terrainImageryUrl = $ImageryHref;
				t.terrainElevationUrl = $ElevationHref;
				t.terrainElevationLayerName = $ElevationLayerName;
				t.terrainImageryLayerName = $ImageryLayerName;

				/******/
				//To support tglobe publishing..(temporarily hardcoded)
				//1. Replace tglobe with www.
				//2. Insert SG before Imagery and Elevation.
				/******/
				if (t.terrainImageryUrl.indexOf("tglobe") != -1)
					t.terrainImageryUrl = t.terrainImageryUrl.replace("tglobe", "www");
				if (t.terrainElevationUrl.indexOf("tglobe") != -1)
					t.terrainElevationUrl = t.terrainElevationUrl.replace(
						"tglobe",
						"www"
					);

				var ImageryIndex = t.terrainImageryUrl.indexOf("/Imagery");
				var ElevationIndex = t.terrainElevationUrl.indexOf("/Elevation");

				if (
					ImageryIndex != -1 &&
					t.terrainImageryUrl.toLowerCase().indexOf("/sg") == -1
				)
					t.terrainImageryUrl =
					t.terrainImageryUrl.slice(0, ImageryIndex) +
					"/SG" +
					t.terrainImageryUrl.slice(ImageryIndex);

				if (
					ElevationIndex != -1 &&
					t.terrainElevationUrl.toLowerCase().indexOf("/sg") == -1
				)
					t.terrainElevationUrl =
					t.terrainElevationUrl.slice(0, ElevationIndex) +
					"/SG" +
					t.terrainElevationUrl.slice(ElevationIndex);

				/******/

				try {
					var uri = new Cesium.Uri(t.terrainImageryUrl);
					// Find the SG between the starting '/' and '/'. This can be different than /SG/ (e.g. it can be /SG710/)
					t.SGVirtualPath =
						uri.path.indexOf("/") == 0 ? uri.path.substring(1) : uri.path;
					t.SGVirtualPath = t.SGVirtualPath.substring(
						0,
						t.SGVirtualPath.indexOf("/")
					);
				} catch (e) {
					t.SGVirtualPath = "SG";
				}

				function registerSubdomains(url) {
					if (domains == undefined) return undefined;

					if (domains.length == 0) return undefined;

					try {
						var uri1 = new Cesium.Uri(url);
						var terrainDomain = uri1.authority.toLowerCase();
						var uri2 = new Cesium.Uri(domains[0]);
						var subDomain = uri2.authority.toLowerCase();
						if (
							terrainDomain != subDomain &&
							terrainDomain.indexOf("www.") == -1
						)
							terrainDomain = "www." + terrainDomain;
						if (terrainDomain == subDomain) return domains;
						else return undefined;
					} catch (e) {
						if (url.indexOf(domains[0]) != -1) return domains;
						else return undefined;
					}
				}

				// Replace the domain name in a url with {s} tag. For example, www.skylineglobe.com/sg/Imagery --> {s}/sg/Imagery
				function replaceDomainWithTag(url) {
					try {
						var uri = new Cesium.Uri(url);
						var result = "";
						if (uri.scheme) result += uri.scheme + ":";
						if (uri.authority) result += "//" + uri.authority;

						url = url.replace(result, "{s}");
					} catch (e) {
						console.log("Could not replace domain with tag for " + url);
					}

					return url;
				}

				var subdomainsImagery = registerSubdomains(t.terrainImageryUrl);
				var subdomainsElevation = registerSubdomains(t.terrainElevationUrl);

				t.terrainSubdomainsImagery = subdomainsImagery;
				t.terrainSubdomainsElevation = subdomainsElevation;

				if (subdomainsImagery != undefined && subdomainsImagery.length > 0)
					t.terrainImageryUrl = replaceDomainWithTag(t.terrainImageryUrl);

				if (subdomainsElevation != undefined && subdomainsElevation.length > 0)
					t.terrainElevationUrl = replaceDomainWithTag(t.terrainElevationUrl);
			}
			// old Kml terrain tag
			else {
				t.terrainUrl = $terrain.find("href").text();

				function registerDomains() {
					// if the href contain a domain which is also in our domains/subdomains object, we replaces the domain name with '{s}' and let cesium an array of subdomains that {s} will be replaced with when doing the actuall request.
					$.each(domains, function(domain, subdomains) {
						if (t.terrainUrl.indexOf(subdomains) != -1) {
							t.terrainUrl = t.terrainUrl.replace(subdomains, "{s}");
							t.terrainSubdomains = domains;
						}
					});
				}

				if (domains == undefined) t.terrainSubdomains = undefined;
				else registerDomains();

				var terrainImagery = $terrain
					.find("sx\\:terrainLayerName, terrainLayerName")
					.text();

				// skylineglobe.tbp skylineglobe.I.tbp
				var i = terrainImagery.lastIndexOf(".");

				if (i != -1)
					t.terrainImagery =
					terrainImagery.substr(0, i) + ".I" + terrainImagery.substr(i);
				else t.terrainImagery = terrainImagery + ".I";

				// skylineglobe.tbp skylineglobe.E.tbp
				if (i != -1)
					t.terrainElevation =
					terrainImagery.substr(0, i) + ".E" + terrainImagery.substr(i);
				else t.terrainElevation = terrainImagery + ".E";
			}

			return t;
		}

		function getDomains(kml) {
			var domains = {};

			var $Domains = $(kml).find("sx\\:Domain, Domain");

			if ($Domains.length == 0) return undefined;

			$Domains.each(function(index, domain) {
				var name = $(domain).attr("name");
				domains[name] = [];

				var $Subdomains = $(domain).find("sx\\:subdomain, subdomain");
				$Subdomains.each(function(index, subdomain) {
					var lastSlash =
						$(subdomain)
						.text()
						.lastIndexOf("/") ==
						$(subdomain).text().length - 1;
					if (lastSlash)
						console.error(
							"Error. Domains/Subdomains addresses should not end with '/'. Please check config.kml"
						);

					domains[name].push($(subdomain).text());
				});
			});

			var arrDomains = [];
			arrDomains.push(Object.keys(domains)[0]);
			var name = Object.keys(domains)[0];
			$.each(domains[name], function(index, value) {
				arrDomains.push(value);
			});

			return arrDomains;
		}

		function onProjectLoaded() {
			if (canContinueFromSplash) {
				//Display Scene with all of its features, only once we see the earth
				var helper = new Cesium.EventHelper();
				showProgress("正在加载地形..");
				if (viewer.ignoreBaseImagery === "true")
					viewer.imageryLayers._layers.shift();
				helper.add(viewer.scene.globe.tileLoadProgressEvent, function(event) {
					if (event == 0) {
						showProgress("初始化UI..");
						setTimeout(function() {
							window.isTELoading = false;
							$("#loadingDiv").remove();
							$("#stepId").remove();
							$("#" + divId).css("visibility", "visible");

							if (mobileApp) {
								TerraExplorer.mobileApp = true;
								$('#sgAccountLabel').remove();
							}

							var project = TerraExplorer.internal.Project;

							//fly to a position specified in the query string
							if (position != 0) {
								var positionValues = position.split(",");
								for (var i = 0; i < positionValues.length; ++i) {
									positionValues[i].trim();
								}
								if (positionValues.length > 1) {
									var Lon, Lat, Distance, Yaw, Pitch;
									Lon =
										positionValues[0] >= -180 && positionValues[0] <= 180 ?
										Number(positionValues[0]) :
										null;
									Lat =
										positionValues[1] >= -90 && positionValues[1] <= 90 ?
										Number(positionValues[1]) :
										null;
									Distance =
										Number(positionValues[2]) > 0 ?
										Number(positionValues[2]) :
										5000;
									Yaw = positionValues[3] ?
										Cesium.Math.toRadians(positionValues[3]) :
										0;
									Pitch = positionValues[4] ?
										Cesium.Math.toRadians(positionValues[4]) :
										-20;
									if (Lon != null && Lat != null) {
										var cartographic = Cesium.Cartographic.fromDegrees(
											Lon,
											Lat,
											0,
											new Cesium.Cartographic()
										);

										//sample terrain -async
										Cesium.sampleTerrain(viewer.terrainProvider, 24, [
											cartographic
										]).then(function(heights) {
											TerraExplorer.internal.Navigate.flyToPosition(
												new TerraExplorer.internal.TEPosition({
													cartesian: Cesium.Cartesian3.fromDegrees(
														Lon,
														Lat,
														heights[0].height
													),
													headingPitchRange: new Cesium.HeadingPitchRange(
														Yaw,
														Pitch,
														Distance
													),
													altitudeType: TerraExplorer.internal.TEPosition
														.ATC_TERRAIN_ABSOLUTE
												})
											);
										});
									}
								}
							}

							// //fly to a position specified in the KML for an object
							var allItems = TerraExplorer.layers.items
								.concat(TerraExplorer.objects.items)
								.concat(TerraExplorer.internal.Project.Locations);
							var index = allItems.length;
							// allItems[0].flyTo();
							console.log(allItems);
							//console.log(allItems[0].prototype.setVisibility);
							
							treeTool();
							
							TerraExplorer.internal.Navigate.flyToPosition(new TerraExplorer.internal.TEPosition({
								cartesian: allItems[index - 1].tePosition.cartesian,
								headingPitchRange: allItems[index - 1].tePosition.headingPitchRange,
								altitudeType: allItems[index - 1].tePosition.altitudeType
							}));
							var startLocationObj = $.grep(allItems, function(item) {
								return (
									item && (item.startLocation ||
										(item._object !== undefined && item._object.startLocation)
									));
							});
							if (startLocationObj.length === 1) {
								if (startLocationObj[0].flyTo !== undefined)
									startLocationObj[0].flyTo();
								else if (startLocationObj[0].tePosition !== undefined)
									TerraExplorer.internal.Navigate.flyToPosition(
										startLocationObj[0].tePosition
									);
							}

							if (!TerraExplorer.isTouch())
								//TerraExplorer.tools.MenuButton.showMenu(); // Comment this to start with the side menu closed.

								//TerraExplorer.tools.ToolManager._tools["SettingsTool"].connectToSG(); //Connecting to SG server as configured in config.kml.

								if (project._userScript !== null && project._userScript !== "") {
									try {
										var startUpFunc = new Function(
											"return " + "function () { " + project._userScript + " }"
										)();
										startUpFunc();
									} catch (e) {
										TerraExplorer.internal.Project.showErrorMessages(e);
									}
								}

							TerraExplorer.internal.Project.showErrorMessages();
							for (var i = 0; i < $(".menuEntry").length - 1; i++)
								if ($($(".menuEntry")[i]).height() !== $($(".menuEntry")[i + 1]).height()) {
									if ($('.menuEntry')[i].children[1].textContent !== "")
										$('#menuButtons span').each(function(i, v) {
											$(v).css('font-size', '17px')
										});
								}

							if (options.showGUI === undefined || !options.showGUI) {
								$("#StatusBarDiv").css("display", "none");
								$("#CenterSign ").css("display", "none");
								$("#NavigationDiv").css("display", "none");
								$("#overlayDiv ").css("display", "none");
								$(".sideBarMain").css("display", "none");
								$("#MenuButtonDiv").css("display", "none");
								$("#cesiumContainer").width($("#" + window.divId).width());
							}

							helper.removeAll();

							window.addEventListener("resize", function() {
								$("#cesiumContainer").width($('#' + window.divId).width() - $('#sideBar').width());
							});

							if (cb !== undefined) cb();
						}, 200);
					}
				});
			}
		}

		function getQueryValue(key) {
			var match = window.location.href.match(
				eval("/[?&]" + key.toLowerCase() + "[=]([^&]+)/i")
			);
			if (match == null) return;

			return unescape(match[1].replace("+", "%20"));
		}

		function getCurrentSitePath() {
			var site = getQueryValue("site");
			return site == undefined ? "" : ("/" + site).replace("#", "");
		}
	}
};
