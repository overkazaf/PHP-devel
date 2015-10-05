var 
	log = console.log,
	res,
	temp;

function countValidBrackets (n, cur) {
	if (Math.floor(2*n) === cur) {
		res.push(temp);
	} else {
		if(countChars(temp, '(') < n) {
			temp += '(';
			countValidBrackets(n, cur+1);
			temp = temp.substring(0, temp.length-1);
		}

		if((countChars(temp, '(') - countChars(temp, ')')) > 0) {
			temp += ')';
			countValidBrackets(n, cur+1);
			temp = temp.substring(0, temp.length-1);
		}
	}
}

function countChars(string, ch){
	var cnt = 0;
	for (var i = 0, l = string.length; i < l; i++) {
		if (ch === string.charAt(i)) {
			cnt++;
		}
	}
	return cnt;
}

function main () {
	var cases = '1,2,3,4,5,6,7,8'.split(',');
	for (var i = 0; i < cases.length; i++) {
		res = [];
		temp = '';
		log('CASE:' + cases[i]);
		countValidBrackets(cases[i], 0);
		log(res);
	}
}

main();