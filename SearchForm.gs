function doGet(e) {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Nova School");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDataFromSheet() {
  var sheet = SpreadsheetApp.openById('1u3_UJedsrlQ250SATtHlC6PqA8SEnGPOJm7ijP2Ze-g').getSheetByName('MidTerm1');
  var data = sheet.getRange('A2:A').getValues(); // Assumes names are in column A starting from row 2
  var nameSuggestions = data.flat().filter(Boolean); // Flatten the 2D array and remove empty values

  return JSON.stringify(nameSuggestions);
}

function getLearners() {
  var sheet = SpreadsheetApp.openById('1u3_UJedsrlQ250SATtHlC6PqA8SEnGPOJm7ijP2Ze-g').getSheetByName('EndTerm1');
  var learners = sheet.getRange("A2:A82").getValues().filter(String);
  return learners;
}

function sub(v) {
  var ss = SpreadsheetApp.openById("1u3_UJedsrlQ250SATtHlC6PqA8SEnGPOJm7ijP2Ze-g"); // Replace with your actual spreadsheet ID
  var sheet = ss.getSheetByName("MidTerm1"); // Replace with the correct sheet name

  var studentData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 16).getValues(); // Assuming your data starts from row 2
  
  for (var i = 0; i < studentData.length; i++) {
    if (v.name == studentData[i][0]) {
      var rowData = studentData[i];

      // Populate the name and homeroom dynamically
      var name = rowData[0];
      var homeRoom = rowData[1];

      // Get the scores for all terms
      var scoresMidTerm1 = getTermScores(ss, "MidTerm1", name);
      var scoresEndTerm1 = getTermScores(ss, "EndTerm1", name);
      var scoresMidTerm2 = getTermScores(ss, "MidTerm2", name);
      var scoresEndTerm2 = getTermScores(ss, "EndTerm2", name);
      var scoresMidTerm3 = getTermScores(ss, "MidTerm3", name);
      var scoresEndTerm3 = getTermScores(ss, "EndTerm3", name);

      var data = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .report-card {
            border: 1px solid #333;
            width: 98%;
            max-width: 100%;
            margin: 0 auto;
            text-align: center;
            font-family: Montserrat, sans-serif;
            overflow-x: auto;
            padding: 20px;
            background: #f4f4f4;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1px;
            border: 1px solid #333;
          }
          th, td {
            border: 1px solid #333;
            padding: 0.5px;
            text-align: center;
            margin: 0;
          }
          th {
            background-color: #ddd;
            font-weight: bold;
          }
          .details {
            text-align: left;
            margin-left: 1px;
            line-height: 1.5;
          }
          .details p {
            margin: 5px 0;
          }
          .grade {
            text-align: left;
            margin-left: 1px;
          }
          .grade span {
            display: block;
          }
          .small-cell {
            height: 0.5px;
          }
          tr:nth-child(odd) td {
            background-color: #90EE90;
          }
          .subject-column td {
            background-color: #90EE90;
          }
          .scrollable-table {
            width: 100%;
            overflow-x: auto;
          }
          #name, #homeRoom, #name-label, #homeRoom-label {
            font-size: 1.2em;
          }
        </style>
      </head>
      <body>
        <div class="report-card">
          <div class="details">
            <p>
              <span id="name-label">Name:</span> <span id="name"><b>${name}</b></span>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              <span id="homeRoom-label">HomeRoom:</span> <span id="homeRoom"><b>${homeRoom}</b></span>
            </p>
          </div>
          <div class="scrollable-table">
            <table>
              <thead>
                <tr>
                  <th rowspan="2">SUBJECTS</th>
                  <th colspan="2" class="term-header">Term 1</th>
                  <th colspan="2" class="term-header">Term 2</th>
                  <th colspan="2" class="term-header">Term 3</th>
                  <th rowspan="2">Average</th>
                </tr>
                <tr>
                  <th>MidTerm1</th>
                  <th>EndTerm1</th>
                  <th>MidTerm2</th>
                  <th>EndTerm2</th>
                  <th>MidTerm3</th>
                  <th>EndTerm3</th>
                </tr>
              </thead>
              <tbody>
      `;

      // List of subjects you want to display
      var subjects = ["Maths", "English", "Kiswahili", "Music", "P.E", "Agriculture", "Sci & Tech", "Social Studies", "Religious Edu.", "TOTAL", "Class Pos", "Grade Pos"];

      // List of subjects to bold
      var subjectsToBold = ["Maths", "English", "Kiswahili", "Music", "P.E", "Agriculture", "Sci & Tech", "Social Studies", "Religious Edu.", "TOTAL", "Grade Pos"];

      var subjectsToAverage = ["Maths", "English", "Kiswahili", "Music", "P.E", "Agriculture", "Sci & Tech", "Social Studies", "Religious Edu.", "TOTAL"];

      // Loop through the subjects and add the rows for each subject
      for (var j = 0; j < subjects.length; j++) {
        var rowClass = subjects[j] === "TOTAL" ? "total-row" : (j % 2 === 0 ? "even-row" : "odd-row");

        data += '<tr class="' + rowClass + '">';
        
        // Check if the current subject should be bolded
        var shouldBold = subjectsToBold.includes(subjects[j]);
        var shouldBoldLabel = subjectsToBold.includes(subjects[j]);

        // Add the subject label with potential bold formatting
        var labelStyle = shouldBoldLabel ? 'font-size: 1.2em;' : '';
        data += '<td class="subject-column" style="' + labelStyle + '">' + (shouldBoldLabel ? '<b>' : '') + subjects[j] + (shouldBoldLabel ? '</b>' : '') + '</td>';

        // Apply bold tags and font size to bold scores, and italics to unbold scores
        var boldStyle = shouldBold ? 'font-size: 1.2em; font-weight: bold;' : 'font-style: italic;';
        var rowBackgroundColor = subjects[j] === "TOTAL" ? 'background-color: #ffff00;' : '';

        var average = calculateAverageForSubject(subjects[j], scoresMidTerm1[j], scoresEndTerm1[j], scoresMidTerm2[j], scoresEndTerm2[j], scoresMidTerm3[j], scoresEndTerm3[j]);

        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresMidTerm1[j] === null ? '' : Math.round(scoresMidTerm1[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresEndTerm1[j] === null ? '' : Math.round(scoresEndTerm1[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresMidTerm2[j] === null ? '' : Math.round(scoresMidTerm2[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresEndTerm2[j] === null ? '' : Math.round(scoresEndTerm2[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresMidTerm3[j] === null ? '' : Math.round(scoresMidTerm3[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + boldStyle + '">' + (scoresEndTerm3[j] === null ? '' : Math.round(scoresEndTerm3[j])) + '</td>';
        data += '<td style="' + rowBackgroundColor + 'color: blue; ' + boldStyle + '">' + (average !== null ? Math.round(average) : '') + '</td>';

        data += '</tr>';
      }

      data += '</tbody></table></div></div></body></html>';

      return data;
    }
  }

  return "Student not found.";
}

function getTermScores(ss, term, name) {
  var sheet = ss.getSheetByName(term);
  if (sheet) {
    var studentData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 17).getValues();
    for (var i = 0; i < studentData.length; i++) {
      if (name == studentData[i][0]) {
        var scores = studentData[i].slice(2, 17);
        // Check for empty or zero scores and replace with null
        return scores.map(score => (score === '' || score === 0) ? null : score);
      }
    }
  }
  return Array(17).fill(null); // Return null for empty scores if sheet not found
}

function calculateAverageForSubject(subject, ...scores) {
  // Filter out null and undefined values
  var validScores = scores.filter((score) => score !== null && score !== undefined);

  if (validScores.length > 0) {
    var sum = validScores.reduce((accumulator, score) => accumulator + score, 0);
    return sum / validScores.length;
  }
  
  return null; // Return null if there are no valid scores
}
