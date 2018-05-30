


function getTags(str) {
	let re = /(#)\w+/g
	var found = str.match(re)
	return found.toString();
}


module.exports = {getTags: getTags}





