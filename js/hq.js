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
    Updated last: S2019
   */
  const peopleList = [
    'Leesha',
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
    const currPairTags = $('#pair-tags').val();

    // check if not blank
    if (currPairTags !== '') {
      // add to pairResults div
      $('#pairResults').append($('<span />')
        .text(replaceAll(currPairTags, ',', ', ')));
      $('#pairResults').append('<br/>');

      // store information for partitioning later on
      pairList.push(currPairTags);
      $("#pair-tags")[0].selectize.clear();
    }
  });

  // undo last add to pairing list
  $('#undoPair').on("click", function(e) {
    // remove from paritioning data
    pairList.pop();

    // remove from UI
    $('#pairResults').text("");
    for (let i = 0; i < pairList.length; i++) {
      $('#pairResults').append($('<span />')
        .text(replaceAll(pairList[i], ',', ', ')));
      $('#pairResults').append('<br/>');
    }
  });


  // add onto list of groupings from LIPs
  $('#addLip').on("click", function(e) {
    const currLipTags = $('#lip-tags').val();

    // check if not blank
    if (currLipTags !== '') {
      // add to lipGroups div with correct color
      let currLipColor = '';
      if (lipList.length >= colors.length) {
        currLipColor = defaultColor;
      } else {
        currLipColor = colors[lipList.length];
      }

      $('#lipGroups').append($('<span />')
        .css('color', currLipColor)
        .text(replaceAll(currLipTags, ',', ', ')));
      $('#lipGroups').append('<br/>');

      // store information for partitioning later on
      lipList.push(currLipTags);
      $("#lip-tags")[0].selectize.clear();
    }
  });

  // undo last add to lip group list
  $('#undoGroup').on("click", function(e) {
    // remove from partitioning data
    lipList.pop();

    // remove from UI
    $('#lipGroups').text("");
    for (let i = 0; i < lipList.length; i++) {
      let currLipColor = '';
      if (i >= colors.length) {
        currLipColor = defaultColor;
      } else {
        currLipColor = colors[i];
      }

      $('#lipGroups').append($('<span />')
        .css('color', currLipColor)
        .text(replaceAll(lipList[i], ',', ', ')));
      $('#lipGroups').append('<br/>');
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

    console.log("we have ", candidateList.length, " candidates");
    for (let i = 0; i < candidateList.length; i++)
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

        if (totalRespect === prefs.length) {
          goodPartitions.push(candidate);
        }
      }
    }
    return goodPartitions;
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
});