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

	let ress = document.getElementsByClassName("result");
	for (i=0; i<ress.length; i = i+1){
		if (i==currInd)
			ress[i].style.backgroundColor = "#00AB41";
		else ress[i].style.backgroundColor = "#000";
	}


}

// function to_timestamp(t) {
// 	let hrs = Math.floor(t / 3600);
// 	let minutes = Math.floor(t / 60);
// 	let seconds = t % 60;
// 	minutes = (minutes - 60 * hrs);
// 	var hrstr;
// 	var minstr;
// 	var secstr;
// 	if (hrs == 0) {
// 		hrstr = "";
// 	} else hrstr = String(hrs).padStart(2,'0');
// 	minstr = String(minutes).padStart(2,'0');
// 	secstr = String(seconds).padStart(2,'0');
// 	return hrstr + ":" + minstr + ":" + secstr;
// }

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


