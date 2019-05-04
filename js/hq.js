$(function() {
    // listen to enter key on fields for quick entry
    $(document).on('keypress', function(e) {
        if (e.which === 13) {
            if (e.currentTarget.activeElement.id === 'pair-tags-selectized') {
                $("#addPair").click();
            } else if (e.currentTarget.activeElement.id === 'lip-tags-selectized') {
                $("#addLip").click();
            }
        }
    });

    /*
      Populating DTR students for the quarter.
      Updated last: S2019
     */
    var peopleList = ['Leesha',
        'Ryan L',
        'Yongsung',
        'Kapil',
        'Andrew',
        'Victoria',
        'Shanks',
        'Gobi',
        'Suzy',
        'Garrett',
        'Sanfeng',
        'Gabriel',
        'Mary',
        'Richard',
        'Navin',
        'Maxine',
        'Judy',
        'Caryl',
        'Daniel',
        'Josh',
        'Cooper'
    ];

    var peopleOptions = peopleList.map(x => ({
        'text': x,
        'value': x
    }))

    $('#pair-tags').selectize({
        persist: false,
        createOnBlur: true,
        create: false,
        options: peopleOptions
    });

    $('#lip-tags').selectize({
        persist: false,
        createOnBlur: true,
        create: false,
        options: peopleOptions
    });

    /*
     Fetching pairing and LIP lists from UI as they are entered.
     */
    var pairList = [];
    var lipList = [];

    // add onto list of pairings from pair research
    $('#addPair').on("click", function(e) {
        var currPairTags = $('#pair-tags').val();

        // check if not blank
        if (currPairTags !== '') {
            $('#pairResults').append(currPairTags + "<br/>");
            pairList.push(currPairTags);
            $("#pair-tags")[0].selectize.clear();
        }
    });

    // undo last add to pairing list
    $('#undoPair').on("click", function(e) {
        pairList.pop();
        $('#pairResults').text("")
        for (var i = 0; i < pairList.length; i++)
            $('#pairResults').append(pairList[i] + "<br/>");
    });


    // add onto list of groupings from LIPs
    $('#addLip').on("click", function(e) {
        var currLipTags = $('#lip-tags').val();

        // check if not blank
        if (currLipTags !== '') {
            $('#lipGroups').append(currLipTags + "<br/>");
            lipList.push(currLipTags);
            $("#lip-tags")[0].selectize.clear();
        }
    });

    // undo last add to lip group list
    $('#undoGroup').on("click", function(e) {
        lipList.pop();
        $('#lipGroups').text("")
        for (var i = 0; i < lipList.length; i++)
            $('#lipGroups').append(lipList[i] + "<br/>");
    });

    var candidateList = [];
    $('#computeGroups').on("click", function(e) {
        candidateList = computeGroups(pairList, lipList);
        var colorIndex = assignColors(lipList)
        if (candidateList.length > 0) {
            displayGroup($("#groupA"), candidateList[0][0], colorIndex)
            displayGroup($("#groupB"), candidateList[0][1], colorIndex)
        }

        $([document.documentElement, document.body]).animate({
            scrollTop: $("#studioGroups").offset().top
        }, 2000);

        console.log("we have ", candidateList.length, " candidates");
        for (var i = 0; i < candidateList.length; i++)
            console.log("candidate: " + candidateList[i].join("--"))
    });


    const getAllSubsets =
        theArray => theArray.reduce(
            (subsets, value) => subsets.concat(
                subsets.map(set => [value, ...set])
            ),
            [
                []
            ]
        );

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {
            return a.indexOf(i) < 0;
        });
    };


    // Assign a color to each pref and create an index
    function displayGroup(ele, group, ci) {
        var content = $('<div />')
        for (var i = 0; i < group.length - 1; i++) {
            if (group[i] in ci)
                content.append($('<span />').css('color', ci[group[i]]).text(group[i] + ", "))
            else
                content.append($('<span />').text(group[i] + ", "))
        }
        if (group[group.length - 1] in ci)
            content.append($('<span />').css('color', ci[group[group.length - 1]]).text(group[group.length - 1]))
        else
            content.append($('<span />').text(group[group.length - 1]))
        ele.html(content)
    }

    // Assign a color to each pref and create an index
    function assignColors(prefs) {
        // assumes no more than colors.length number of prefs
        var colors = [
            '#e41a1c',
            '#377eb8',
            '#4daf4a',
            '#984ea3',
            '#ff7f00',
            '#a65628',
            '#f781bf',
            '#999999'
        ];

        var colorIndex = {};
        colors = colors.slice(0, prefs.length);

        for (var i = 0; i < prefs.length; i++) {
            var people = prefs[i].split(",");

            for (var j = 0; j < people.length; j++) {
                colorIndex[people[j]] = colors[i];
            }
        }
        return colorIndex;
    }

    // Form 2 groups that satisfy hard preferences to stay together
    // and maximizes the number of soft preferences met
    function computeGroups(hardPrefs, softPrefs) {
        // find everyone who is here today
        var people = makeListFromPrefs(hardPrefs);
        //  console.log("People: " + people)

        // get candidate groupings that satisfy pair research matches
        var candidates = computeGoodHardPartitions(people, hardPrefs);
        console.log('Possible Hard Partition Candidates:');
        console.log(candidates);

        // rank partitions based on how many soft constraints they respect
        var goodCandidates = computeGoodSoftPartitions(candidates, softPrefs);
        console.log('Possible Good Partition Candidates:');
        console.log(goodCandidates);

        return goodCandidates
    }

    function computeGoodSoftPartitions(candidates, prefs) {
        // candidates: [[groupA, groupB], ...]
        // prefs: ["a,b","c,d,e"]
        return candidates.sort(function(a, b) {
            return computeScore(b, prefs) - computeScore(a, prefs)
        })
    }

    function computeScore(c1, prefs) {
        return respectCount(c1[0], prefs) + respectCount(c1[1], prefs)
    }

    function computeGoodHardPartitions(people, prefs) {
        // prefs: ["a,b","c,d,e"]

        // make all possible partitions of those people
        var allSubsets = getAllSubsets([...people])

        // look for all subsets of roughly equal size
        let rightLength = Math.floor(people.length / 2);
        var goodPartitions = [];

        // get all subsets that perfectly respect prefs to stay together, e.g., each pref is in set A or B.
        for (var i = 0; i < allSubsets.length; i++) {
            if (allSubsets[i].length == rightLength ||
                allSubsets[i].length == rightLength - 1) {
                // HACK to allow for 4/6 partition and
                // 5/5 partition to preserve pair research teams
                let candidate = [allSubsets[i], people.diff(allSubsets[i])];
                totalRespect = computeScore(candidate, prefs);

                if (totalRespect == prefs.length) {
                    goodPartitions.push(candidate);
                }
            } else continue;
        }
        return goodPartitions;
    }


    // counts how many of the prefs to be grouped together are
    // met by this grouping
    function respectCount(group, prefs) {
        var count = 0;
        prefs.forEach(function(e) {
            var pref = e.split(',');

            if (pref.length == 1) {
                if (group.includes(pref[0])) {
                    count++;
                }
            } else if (pref.length == 2) {
                if (group.includes(pref[0]) && group.includes(pref[1])) {
                    count++;
                }
            } else { // assumes pref.length > 2
                for (var i = 0; i < pref.length - 1; i++) {
                    for (var j = i; j < pref.length - 1; j++) {
                        if (group.includes(pref[i]) && group.includes(pref[j + 1])) {
                            count++
                        }
                    }
                }
            }
        });

        return count;
    }

    // make a set of all people
    function makeListFromPrefs(prefs) {
        // prefs: ["a,b","c,d,e"]
        var s = new Set();
        prefs.forEach(function(e) {
            var pref = e.split(',');
            pref.forEach(function(p) {
                s.add(p);
            });
        });
        return [...s];
    }
});