var times = [];
var currInd = 0;


function getTimes(times_) {
	times = times_;
	return times_;
}


function setNewSrc(currInd) {
	console.log(currInd);
	var vid = document.getElementById("video");
	let currSrc = vid.src;
	let ind = currSrc.indexOf('?start');
	let init = currSrc.slice(0, ind);
	vid.src = (init + "?start=" + times[currInd]);

	let ress = document.getElementsByClassName("result");
	for (i=0; i<ress.length; i = i+1){
		if (i==currInd)
			ress[i].style.backgroundColor = "#00AB41";
		else ress[i].style.backgroundColor = "#000";
	}


}

function prev_() {
	if (currInd <= 0) currInd = 0;
	else currInd = currInd - 1;
	setNewSrc(currInd);

}

function next_() {
	if (currInd >= times.length - 1) currInd = times.length - 1;
	else currInd = currInd + 1;
	setNewSrc(currInd);
}

function resultClicked(ev) {
	let txt = ev.target.innerHTML;
	let endIndp1 = txt.indexOf('at');
	let numStr = txt.slice(7,endIndp1-1);
	currInd = parseInt(numStr) - 1;
	setNewSrc(currInd);

}

window.onload = function() {
	document.getElementById("prev").onclick = prev_;
	document.getElementById("nxt").onclick = next_;

	var ress = document.getElementsByClassName("result");
	for (i=0; i<ress.length; i = i+1){
		ress[i].addEventListener('click', resultClicked);
	}
	ress[0].style.backgroundColor = "#00AB41";

}


