// Copyright (c) 2022, Joshua Mark
// All rights reserved.

// This source code is licensed under the BSD-style license found in the
// LICENSE file in the root directory of this source tree. 

var times = [];
var timestr = [];
var currInd = 0;


function getTimes(times_, timestr_) {
	times = times_;
	timestr = timestr_;
	return [times_, timestr_];
}


function setNewSrc(currInd) {
	console.log(currInd);
	var vid = document.getElementById("video");
	let currSrc = vid.src;
	let ind = currSrc.indexOf('?start');
	let init = currSrc.slice(0, ind);
	vid.src = (init + "?start=" + times[currInd]);
}

function setDdValue(ind) {
	document.getElementById("resDd").selectedIndex = ind;
}


function prev_() {
	if (currInd <= 0) currInd = 0;
	else currInd = currInd - 1;
	setNewSrc(currInd);
	setDdValue(currInd);

}

function next_() {
	if (currInd >= times.length - 1) currInd = times.length - 1;
	else currInd = currInd + 1;
	setNewSrc(currInd);
	setDdValue(currInd);
}


function ddChanged(ev) {
	let ind = parseInt(ev.target.value);
	setNewSrc(ind);
	currInd = ind;
}

window.onload = function() {
	document.getElementById("prev").onclick = prev_;
	document.getElementById("nxt").onclick = next_;

	var dd = document.getElementById("resDd");
	dd.addEventListener('change', ddChanged);

}


