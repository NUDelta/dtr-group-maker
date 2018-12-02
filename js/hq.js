$(function() {
    // add onto list of pairings from pair research
    $('#addPair').on("click", function(e) {
	$('#pairResults').append($('#pair-tags').val() + "<br/>");
	pairList.push($('#pair-tags').val());
	$("#pair-tags")[0].selectize.clear();
    });
    // undo last add
    $('#undoPair').on("click", function(e) {
	pairList.pop();
	$('#pairResults').text("")
	for(var i = 0; i < pairList.length; i++)
	    $('#pairResults').append(pairList[i] + "<br/>");
    });


    // add onto list of groupings from LIPs
    $('#addLip').on("click", function(e) {
	$('#lipGroups').append($('#lip-tags').val() + "<br/>");
	lipList.push($('#lip-tags').val());
	$("#lip-tags")[0].selectize.clear();
    });
    // undo last add
    $('#undoGroup').on("click", function(e) {
	lipList.pop();
	$('#lipGroups').text("")
	for(var i = 0; i < lipList.length; i++)
	    $('#lipGroups').append(lipList[i] + "<br/>");
    });

    
    
    $('#computeGroups').on("click", function(e) {
	candidateList = computeGroups(pairList, lipList);
	if(candidateList.length > 0){
	    $("#groupA").text(candidateList[0][0])
	    $("#groupB").text(candidateList[0][1])
	}
	
	$([document.documentElement, document.body]).animate({
	    scrollTop: $("#studioGroups").offset().top
	}, 2000);
	
	console.log("we have ", candidateList.length, " candidates");
	for(var i = 0; i < candidateList.length; i++)
	    console.log("candidate: " + candidateList[i].join("--"))
    });
    
    
    const getAllSubsets = 
	theArray => theArray.reduce(
            (subsets, value) => subsets.concat(
         subsets.map(set => [value,...set])
            ),
            [[]]
	);
    
    Array.prototype.diff = function(a) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    // Form 2 groups that satisfy hard preferences to stay together
    // and maximizes the number of soft preferences met
    function computeGroups(hardPrefs, softPrefs){
	// find everyone who is here today
	var people = makeListFromPrefs(hardPrefs);
	console.log("People: " + people)

	// get candidate groupings that satisfy pair research matches
	var candidates = computeGoodHardPartitions(people, hardPrefs);
	
	// rank partitions based on how many soft constraints they respect
	var goodCandidates = computeGoodSoftPartitions(candidates, softPrefs);
	return goodCandidates
    }
    
    function computeGoodSoftPartitions(candidates, prefs){
	// candidates: [[groupA, groupB], ...]
	// prefs: ["a,b","c,d,e"]
	return candidates.sort(function(a,b){
	    return computeScore(b, prefs) - computeScore(a, prefs)
	})
    }
    
    function computeScore(c1, prefs){
	return respectCount(c1[0], prefs) + respectCount(c1[1], prefs)
    }
    
    function computeGoodHardPartitions(people, prefs){
	// prefs: ["a,b","c,d,e"]
	
	// make all possible partitions of those people
	var allSubsets = getAllSubsets([...people])
	
	// look for all subsets of roughly equal size
	let rightLength = Math.floor(people.length / 2)
	var goodPartitions = [];
	
	// get all subsets that perfectly respect prefs to stay together, e.g., each pref is in set A or B.
	for (var i = 0; i < allSubsets.length; i++){
	    if(allSubsets[i].length == rightLength || 
	       allSubsets[i].length == rightLength - 1){
		// HACK to allow for 4/6 partition and 
		// 5/5 partition to preserve pair research teams
		let candidate = [allSubsets[i], people.diff(allSubsets[i])]
		totalRespect = computeScore(candidate, prefs)
		if(totalRespect == prefs.length)
		    goodPartitions.push(candidate)
	    }else continue;
	}
	return goodPartitions;
    }
    

    // counts how many of the prefs to be grouped together are 
    // met by this grouping
    function respectCount(group, prefs){
	var count = 0;
	prefs.forEach(function(e){
	    var pref = e.split(',');
	    if (pref.length == 1){
		if (group.includes(pref[0]))
		    count++;
	    }else if (pref.length ==2){
		if (group.includes(pref[0]) && group.includes(pref[1])) 
		    count++;
	    }else{ // assumes pref.length > 2
		for (var i = 0; i < pref.length - 1; i++){
		    for(var j = i; j < pref.length - 1; j++){
			if (group.includes(pref[i]) && group.includes(pref[j+1]))
			    count++
		    }
		}
	    }
	})
	return count;
    }

	
    
    //   note how many preferences they respect in A
    // respect means if both people are in set
    // note how many preferences they respect in B
    // PAIR RESEARCH ARE HARD CONSTRAINTS
    

    
    // make a set of all people
    function makeListFromPrefs(prefs){
	// prefs: ["a,b","c,d,e"]
	var s = new Set();
	prefs.forEach(function(e){
	    var pref = e.split(',');
	    pref.forEach(function(p){
		s.add(p);
	    });
	});
	return [...s];
    }
    
});
    
