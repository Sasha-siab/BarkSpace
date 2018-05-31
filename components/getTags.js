


function getTags(str) {
	let re = /(#)\w+/g
	var found = str.match(re);
	if (found) {
		return found.toString();
	}
}


module.exports = {getTags: getTags}
