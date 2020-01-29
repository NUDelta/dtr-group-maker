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

  // helper function for string replace all
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  /*
    Populating DTR students for the quarter.
    Updated last: W2020
   */
  const peopleList = [
    'Yongsung',
    'Leesha',
    'Ryan L',
    'Gobi',
    'Kapil',
    'Harrison',
    'Garrett',
    'Shanks',
    'Olivia',
    'Zev',
    'Maxine',
    'Salome',
    'Cooper',
    'Abizar',
    'David',
    'Nina',
    'Mary',
    'Amy',
    'Caryl',
    'Josh K',
    'Vishal'
  ];

  const phdStudents = new Set([
    'Yongsung',
    'Leesha',
    'Ryan L',
    'Gobi',
    'Kapil',
    'Harrison',
    'Garrett'
  ]);

  const teamsList = [
    ['Olivia', 'Zev'],
    ['David', 'Nina'],
    ['Mary', 'Amy'],
    ['Caryl', 'Josh']
  ];

  const peopleOptions = peopleList.map(x => ({
    'text': x,
    'value': x
  }));

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
  const pairList = [];
  const lipList = [];

  // add onto list of pairings from pair research
  $('#addPair').on("click", function(e) {
    const $pairResults = $('#pairResults');
    const $pairTags = $('#pair-tags');

    const currPairTags = $pairTags.val();

    // check if not blank
    if (currPairTags !== '') {
      addPair($pairResults, currPairTags);
      $pairTags[0].selectize.clear();
    }
  });

  // add all teams
  $('#addTeams').on("click", function(e) {
    const $pairResults = $('#pairResults');

    // iterate through teams and add each of them
    teamsList.forEach(currTeam => {
      // construct tuple from team array
      let currTeamTuple = currTeam.join(',');

      // add pair
      addPair($pairResults, currTeamTuple);
    });
  });

  function addPair(uiEle, currPairTags) {
    // add to pairResults div
    uiEle.append($('<span />').text(replaceAll(currPairTags, ',', ', ')));
    uiEle.append('<br/>');

    // store information for partitioning later on
    pairList.push(currPairTags);
  }

  // undo last add to pairing list
  $('#undoPair').on("click", function(e) {
    const $pairResults = $('#pairResults');

    // remove from paritioning data
    pairList.pop();

    // remove from UI
    $pairResults.text("");
    for (let i = 0; i < pairList.length; i++) {
      $pairResults.append($('<span />').text(replaceAll(pairList[i], ',', ', ')));
      $pairResults.append('<br/>');
    }
  });

  // add onto list of groupings from LIPs
  $('#addLip').on("click", function(e) {
    const $lipGroups = $('#lipGroups');
    const $lipTags = $('#lip-tags');

    const currLipTags = $lipTags.val();

    // check if not blank
    if (currLipTags !== '') {
      addLipGroup($lipGroups, currLipTags);
      $lipTags[0].selectize.clear();
    }
  });

  function addLipGroup(uiEle, currLipTags) {
    // add to lipGroups div with correct color
    let currLipColor = '';
    if (lipList.length >= colors.length) {
      currLipColor = defaultColor;
    } else {
      currLipColor = colors[lipList.length];
    }

    uiEle.append($('<span />')
         .css('color', currLipColor)
         .text(replaceAll(currLipTags, ',', ', ')));
    uiEle.append('<br/>');

    // store information for partitioning later on
    lipList.push(currLipTags);
  }

  // undo last add to lip group list
  $('#undoGroup').on("click", function(e) {
    const $lipGroups = $('#lipGroups');

    // remove from partitioning data
    lipList.pop();

    // remove from UI
    $lipGroups.text("");
    for (let i = 0; i < lipList.length; i++) {
      let currLipColor = '';
      if (i >= colors.length) {
        currLipColor = defaultColor;
      } else {
        currLipColor = colors[i];
      }

      $lipGroups.append($('<span />')
        .css('color', currLipColor)
        .text(replaceAll(lipList[i], ',', ', ')));
      $lipGroups.append('<br/>');
    }
  });

  let candidateList = [];
  $('#computeGroups').on("click", function(e) {
    // compute groups
    candidateList = computeGroups(pairList, lipList);

    // get colors for each lip
    const colorIndex = assignColors(lipList);
    if (candidateList.length > 0) {
      displayGroup($("#groupA"), candidateList[0][0], colorIndex);
      displayGroup($("#groupB"), candidateList[0][1], colorIndex)
    }

    $([document.documentElement, document.body]).animate({
      scrollTop: $("#studioGroups").offset().top
    }, 2000);
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
  function displayGroup(ele, group, colorIndex) {
    // pre-initialize colors dictionary
    const colorGroups = {};
    colors.forEach(function(color) {
      colorGroups[color] = [];
    });
    colorGroups[defaultColor] = [];

    // group people by LIP color
    group.forEach(function(currPerson) {
      // add person to each color group based on their assigned color
      // if not in colorIndex, assign them default
      if (currPerson in colorIndex) {
        const currColor = colorIndex[currPerson];
        colorGroups[currColor].push(currPerson);
      } else {
        colorGroups[defaultColor].push(currPerson);
      }
    });

    // create HTML content
    const content = $('<div />');
    let isFirstGroup = true;

    for (let colorKey in colorGroups) {
      // add each group member with color styling
      if (colorGroups.hasOwnProperty(colorKey) && colorGroups[colorKey].length > 0) {
        const currPeople = colorGroups[colorKey];
        const currPeopleText = currPeople.join(', ');

        // check if | should be added
        if (!isFirstGroup) {
          content.append(' | ');
        } else {
          isFirstGroup = false;
        }

        content.append($('<span />').css('color', colorKey).text(currPeopleText));
      }
    }

    // add context to html element
    ele.html(content)
  }

  // Assign a color to each pref and create an index
  const colors = [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#a65628',
    '#f781bf',
    '#999999'
  ];
  const defaultColor = '#454545';

  function assignColors(prefs) {
    const colorIndexDict = {};
    let colorIndex = 0;

    // iterate over preferences and assign colors
    for (let i = 0; i < prefs.length; i++) {
      // get list of people in the group
      const people = prefs[i].split(",");

      // figure out what color to use for the group
      let groupColor = '';
      if (colorIndex < colors.length) {
        groupColor = colors[colorIndex];
        colorIndex++;
      } else {
        groupColor = defaultColor;
      }

      // set color for each person in group
      for (let j = 0; j < people.length; j++) {
        colorIndexDict[people[j]] = groupColor;
      }
    }

    return colorIndexDict;
  }

  // Form 2 groups that satisfy hard preferences to stay together
  // and maximizes the number of soft preferences met
  function computeGroups(hardPrefs, softPrefs) {
    // find everyone who is here today
    const people = makeListFromPrefs(hardPrefs);
    //  console.log("People: " + people)

    // get candidate groupings that satisfy pair research matches
    const candidates = computeGoodHardPartitions(people, hardPrefs);
    console.log('Possible Hard Partition Candidates:');
    console.log(candidates);

    // rank partitions based on how many soft constraints they respect
    const goodCandidates = computeGoodSoftPartitions(candidates, softPrefs);
    console.log('Possible Good Partition Candidates:');
    console.log(goodCandidates);

    // make sure Group A is always larger if difference in size and display
    console.log(`we have ${ goodCandidates.length } good candidates.`);
    for (let i = 0; i < goodCandidates.length; i++) {
      // compare sizes
      if (goodCandidates[i][1].length > goodCandidates[i][0].length) {
        goodCandidates[i] = [[...goodCandidates[i][1]], [...goodCandidates[i][0]]];
      }

      console.log(`Candidate ${ i + 1 } (${ computeScore(goodCandidates[i], hardPrefs) } / ${ numPrefs(hardPrefs) } Hard Pref Respected; ${ computeScore(goodCandidates[i], softPrefs) } / ${ numPrefs(softPrefs) } Soft Pref Respected)
      Group A (${ goodCandidates[i][0].length } people; ${ numPhdStudents(goodCandidates[i][0]) } PhD students): ${ goodCandidates[i][0].join(', ') }
      Group B (${ goodCandidates[i][1].length } people; ${ numPhdStudents(goodCandidates[i][1]) } PhD students): ${ goodCandidates[i][1].join(', ') } \n`)
    }

    // [Group A, Group B] = ["A, B, C", "D, E, F"]
    return goodCandidates
  }

  function computeGoodSoftPartitions(candidates, prefs) {
    // candidates: [[groupA, groupB], ...]
    // prefs: ["a,b","c,d,e"]

    // sorting criteria
    // 1. number of soft constraints respected
    // 2. evenness of size between groups (same size is best)
    // 3. evenness of number of PhD students (same is better)
    return candidates.sort(function(a, b) {
      return (computeScore(b, prefs) - computeScore(a, prefs)) ||
        (Math.abs(a[0].length - a[1].length) - Math.abs(b[0].length - b[1].length)) ||
        (Math.abs(numPhdStudents(a[0]) - numPhdStudents(a[1])) - Math.abs(numPhdStudents(b[0]) - numPhdStudents(b[1])));
    })
  }

  function numPhdStudents(group) {
    let phdStudentCount = 0;
    group.forEach(groupMember => {
      if (phdStudents.has(groupMember)) {
        phdStudentCount++
      }
    });

    return phdStudentCount;
  }

  function computeScore(c1, prefs) {
    return respectCount(c1[0], prefs) + respectCount(c1[1], prefs)
  }

  function computeGoodHardPartitions(people, prefs) {
    // prefs: ["a,b","c,d,e"]

    // make all possible partitions of those people
    const allSubsets = getAllSubsets([...people]);

    // look for all subsets of roughly equal size
    let rightLength = Math.floor(people.length / 2);
    const goodPartitions = [];

    // get all subsets that perfectly respect prefs to stay together, e.g., each pref is in set A or B.
    for (let i = 0; i < allSubsets.length; i++) {
      if (allSubsets[i].length === rightLength ||
        allSubsets[i].length === rightLength - 1) {
        // HACK to allow for 4/6 partition and
        // 5/5 partition to preserve pair research teams
        let candidate = [allSubsets[i], people.diff(allSubsets[i])];
        let totalRespect = computeScore(candidate, prefs);

        if (totalRespect === numPrefs(prefs)){
          goodPartitions.push(candidate);
        }
      }
    }
    return goodPartitions;
  }

  function numPrefs(prefs){
      // prefs: ["a,b","c,d,e"] => 4 (1 + 3, since [a,b,c] is actually [a,b],[b,c], and [a,c]).

      // TODO: doesn't handle duplicates across the preference list.
      let total = 0;
      for (let i = 0; i < prefs.length; i++) {
        // compute number of unique combinations without order and repetition
        let n = prefs[i].split(',').length;
        let r = 2;

        if (n === 1) {
          total += 1;
        } else {
          total += factorial(n) / (factorial(r) * factorial(n - r));
        }
      }
      return total;
  }

  function factorial(num) {
    let rval = 1;
    for (let i = 2; i <= num; i++) {
      rval = rval * i;
    }

    return rval;
  }

  // counts how many of the prefs to be grouped together are
  // met by this grouping
  function respectCount(group, prefs) {
    let count = 0;
    prefs.forEach(function(e) {
      const pref = e.split(',');

      if (pref.length === 1) {
        if (group.includes(pref[0])) {
          count++;
        }
      } else if (pref.length === 2) {
        if (group.includes(pref[0]) && group.includes(pref[1])) {
          count++;
        }
      } else { // assumes pref.length > 2
        for (let i = 0; i < pref.length - 1; i++) {
          for (let j = i; j < pref.length - 1; j++) {
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
    const s = new Set();
    prefs.forEach(function(e) {
      const pref = e.split(',');
      pref.forEach(function(p) {
        s.add(p);
      });
    });
    return [...s];
  }

  /*
   TESTING CODE
   */
  const testHard = [
    ['Olivia', 'Zev'],
    ['David', 'Nina'],
    ['Mary', 'Amy'],
    ['Caryl', 'Josh'],
    ['David', 'Garrett'],
    ['Vishal', 'Mary'],
    ['Zev', 'Salome'],
    ['Amy', 'Caryl'],
    ['Gobi', 'Josh K'],
    ['Abizar', 'Shanks'],
    ['Kapil', 'Nina'],
    ['Olivia', 'Maxine'],
    ['Ryan L'],
    ['Leesha']
  ];

  const testSoft = [
    ['Kapil', 'David', 'Nina', 'Mary', 'Amy'],
    ['Ryan L', 'Leesha', 'Garrett', 'Shanks'],
    ['Abizar', 'Zev', 'Salome']
  ];

  // add all teams
  $('#addTesting').on("click", function(e) {
    // iterate through each hard constraint and add each of them
    const $pairResults = $('#pairResults');
    testHard.forEach(currHard => {
      // construct tuple from team array
      let currHardTuple = currHard.join(',');

      // add pair
      addPair($pairResults, currHardTuple);
    });

    // iterate through each soft constraint and add each of them
    const $lipGroups = $('#lipGroups');
    testSoft.forEach(currSoft => {
      // construct tuple from team array
      let currSoftTuple = currSoft.join(',');

      // add pair
      addLipGroup($lipGroups, currSoftTuple);
    });
  });
});
