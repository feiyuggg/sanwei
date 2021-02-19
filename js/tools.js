function getTools() {
	var mydiv2 = document.getElementById("toolTree");
	if (flag2 % 2 == 1) mydiv2.style.display = 'block';
	else mydiv2.style.display = 'none';
	flag2 %= 2;
	flag2++;

	var setting = {
		view: {
			dblClickExpand: false,
			showLine: true,
			fontCss: getFont,
			nameIsHTML: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: onClick,
			//onCheck: onCheck
		}
	};

	var zNodes = [{
		id: 1,
		pId: 0,
		name: "测量距离",
		open: false,
		nocheck: true,
		icon: "./css/zTreeStyle/img/diy/2.png",
		font: {
			'color': '#ffffff'
		}
	}, {
		id: 2,
		pId: 0,
		name: "测量面积",
		open: false,
		nocheck: true,
		icon: "./css/zTreeStyle/img/diy/2.png",
		font: {
			'color': '#ffffff'
		}
	}]


	function getFont(treeId, node) {
		return node.font ? node.font : {};
	}

	function onClick(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("toolTree");
		zTree.expandNode(treeNode);
		if (treeNode.id == 1) TerraExplorer.analysis.distance.startTool();
		if (treeNode.id == 2) TerraExplorer.analysis.area.startTool();
	}

	// if (TerraExplorer.navigate.underground.mode == false) zNodes[2].checked = false;
	// else zNodes[2].checked = true;

	// function onCheck(e, treeId, treeNode) {
	// 	if (treeNode.checked == true) TerraExplorer.navigate.underground.mode = true;
	// 	else TerraExplorer.navigate.underground.mode = false;
	// }

	$(document).ready(function() {
		$.fn.zTree.init($("#toolTree"), setting, zNodes);
	});


}
