function treeTool() {
	var datas = TerraExplorer.layers.items;
	var mydiv = document.getElementById("treeDemo");
	if (flag % 2 == 1) mydiv.style.display = 'block';
	else mydiv.style.display = 'none';
	flag %= 2;
	flag++;

	var setting = {
		view: {
			dblClickExpand: false,
			showLine: true,
			fontCss: getFont,
			nameIsHTML: true
		},
		check: {
			enable: true,
			nocheckInherit: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: onClick,
			onCheck: onCheck
		}
	};
	var zNodes = [{
			id: 1,
			pId: 0,
			name: "位置",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': '#ffffff'
			}
		},
		{
			id: 2,
			pId: 0,
			name: "现状城市模型",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 3,
			pId: 0,
			name: "控规",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 4,
			pId: 0,
			name: "总体城市设计",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 5,
			pId: 0,
			name: "分区城市设计",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 6,
			pId: 0,
			name: "区段城市设计",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 7,
			pId: 0,
			name: "地块城市设计",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
		{
			id: 8,
			pId: 0,
			name: "报建方案",
			open: true,
			nocheck: false,
			iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
			iconClose: "./css/zTreeStyle/img/diy/1_close.png",
			icon: "./css/zTreeStyle/img/diy/1_close.png",
			font: {
				'color': 'white'
			}
		},
	];
	var index = new Array(8);
	index.fill(0);
	for (var i = 0; i < datas.length; i++) {
		if (datas[i].type.indexOf("Feature") >= 0) {
			var str = datas[i]._object._layerDisplayName.split("_");

			if (str[0].toUpperCase() == "BJFA") {
				var json = {
					id: (17 + i),
					pId: 8,
					name: str[1],
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}

			if (str[0].toUpperCase() == "控规") {
				var json = {
					id: (17 + i),
					pId: 3,
					name: str[1],
					font: {
						'color': 'white'
					},
					checked: false
				};
				zNodes.push(json);
			}

			if (str[0].toUpperCase() == "XZ") {
				var json = {
					id: (17 + i),
					pId: 2,
					name: str[1],
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "ZT") {

				if (index[0] == 0) {
					index[0]++;
					var json2 = {
						id: 9,
						pId: 4,
						name: "总体城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 9,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "ZTZB") {

				if (index[1] == 0) {
					index[1]++;
					var json2 = {
						id: 10,
						pId: 4,
						name: "总体城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 10,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "FQ") {

				if (index[2] == 0) {
					index[2]++;
					var json2 = {
						id: 11,
						pId: 5,
						name: "分区城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 11,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "FQZB") {
				if (index[3] == 0) {
					index[3]++;
					var json2 = {
						id: 12,
						pId: 5,
						name: "分区城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}
				var json = {
					id: (17 + i),
					pId: 12,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "QD") {

				if (index[4] == 0) {
					index[4]++;
					var json2 = {
						id: 13,
						pId: 6,
						name: "区段城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 13,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "QDZB") {

				if (index[5] == 0) {
					index[5]++;
					var json2 = {
						id: 14,
						pId: 6,
						name: "区段城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 14,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "DK") {

				if (index[6] == 0) {
					index[6]++;
					var json2 = {
						id: 15,
						pId: 7,
						name: "地块城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 15,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "DKZB") {

				if (index[7] == 0) {
					index[7]++;
					var json2 = {
						id: 16,
						pId: 7,
						name: "地块城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 16,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}

		} else if (datas[i].type == 'mesh') {
			var str = datas[i]._object.displayName.split("_");

			if (str[0].toUpperCase() == "控规") {
				var json = {
					id: (17 + i),
					pId: 3,
					name: str[1],
					font: {
						'color': 'white'
					},
					checked: false
				};
				zNodes.push(json);
			}

			if (str[0].toUpperCase() == "BJFA") {
				var json = {
					id: (17 + i),
					pId: 8,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}

			if (str[0].toUpperCase() == "XZ") {
				var json = {
					id: (17 + i),
					pId: 2,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "ZT") {

				if (index[0] == 0) {
					index[0]++;
					var json2 = {
						id: 9,
						pId: 4,
						name: "总体城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 9,
					name: str[1],
					nocheck: false,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "ZTZB") {

				if (index[1] == 0) {
					index[1]++;
					var json2 = {
						id: 10,
						pId: 4,
						name: "总体城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 10,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "FQ") {

				if (index[2] == 0) {
					index[2]++;
					var json2 = {
						id: 11,
						pId: 5,
						name: "分区城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 11,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "FQZB") {

				if (index[3] == 0) {
					index[3]++;
					var json2 = {
						id: 12,
						pId: 5,
						name: "分区城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 12,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "QD") {

				if (index[4] == 0) {
					index[4]++;
					var json2 = {
						id: 13,
						pId: 6,
						name: "区段城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 13,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "QDZB") {

				if (index[5] == 0) {
					index[5]++;
					var json2 = {
						id: 14,
						pId: 6,
						name: "区段城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 14,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "DK") {

				if (index[6] == 0) {
					index[6]++;
					var json2 = {
						id: 15,
						pId: 7,
						name: "地块城市设计模型",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 15,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				zNodes.push(json);
			}
			if (str[0].toUpperCase() == "DKZB") {

				if (index[7] == 0) {
					index[7]++;
					var json2 = {
						id: 16,
						pId: 7,
						name: "地块城市设计指标",
						nocheck: false,
						iconOpen: "./css/zTreeStyle/img/diy/1_open.png",
						iconClose: "./css/zTreeStyle/img/diy/1_close.png",
						icon: "./css/zTreeStyle/img/diy/1_close.png",
						font: {
							'color': 'white'
						}
					};
					zNodes.push(json2);
				}

				var json = {
					id: (17 + i),
					pId: 16,
					name: str[1],
					checked: true,
					font: {
						'color': 'white'
					}
				};
				datas[i].show = false;
				zNodes.push(json);
			}
		}
	}

	var items = TerraExplorer.layers.items;

	for (var i = 0; i < zNodes.length; i++) {
		if (zNodes[i].id >= 17) {
			if (items[zNodes[i].id - 17].show == false) {
				zNodes[i].checked = false;
			} else {
				zNodes[i].checked = true;
			}
		}
	}

	var items = TerraExplorer.objects.items
		.concat(TerraExplorer.objects.items)
		.concat(TerraExplorer.internal.Project.Locations);
	var numItems = TerraExplorer.layers.items;
	var num = numItems.length;
	console.log(items);
	for (var i = 0; i < items.length; i++) {
		var json = {
			id: num + 17,
			pId: 1,
			name: items[i].name.split('_')[1],
			nocheck: false,
			icon: "./css/zTreeStyle/img/diy/3.png",
			font: {
				'color': 'white'
			}
		};
		zNodes.push(json);
		num++;
	}
	num--; //重要数据

	function getFont(treeId, node) {
		return node.font ? node.font : {};
	} 

	function onCheck(e, treeId, treeNode) {
		var allItems = TerraExplorer.layers.items
			.concat(TerraExplorer.objects.items)
			.concat(TerraExplorer.internal.Project.Locations);
		if (allItems[treeNode.id - 17].show == false) allItems[treeNode.id - 17].show = true;
		else allItems[treeNode.id - 17].show = false;
	}

	function onClick(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.expandNode(treeNode);
		var allItems = TerraExplorer.layers.items
			.concat(TerraExplorer.objects.items)
			.concat(TerraExplorer.internal.Project.Locations);
		if (treeNode.id >= 17 && treeNode.id < num + 17) {
			allItems[treeNode.id - 17].flyTo();
		}
		if (treeNode.id >= num + 17) {
			TerraExplorer.internal.Navigate.flyToPosition(new TerraExplorer.internal.TEPosition({
				cartesian: allItems[treeNode.id - 17].tePosition.cartesian,
				headingPitchRange: allItems[treeNode.id - 17].tePosition.headingPitchRange,
				altitudeType: allItems[treeNode.id - 17].tePosition.altitudeType
			}));
		}
	}

	$(document).ready(function() {
		$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	});

}
