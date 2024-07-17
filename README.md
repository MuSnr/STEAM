# NPTP Grade 6 Progress Records - 2024

This project is a web-based application for managing and displaying the progress records of Grade 6 students at NPTP. It includes features for entering student names, selecting classes, and dynamically loading student data with suggestions.

## Features

- **Student Name Suggestions:** Auto-suggests student names based on the selected class.
- **Dynamic Class Selection:** Filter student names by class.
- **Countdown Timer:** A countdown timer for certain actions with visual feedback.
- **Print Functionality:** Print the progress records.

## Technologies Used

- HTML
- CSS (W3.CSS and Font Awesome)
- JavaScript

## Getting Started

### Prerequisites

- A modern web browser
- Internet connection (for loading external CSS)

### Installation

1. Clone the repository or download the project files.
2. Open the `index.html` file in a web browser.

### Usage

1. Open the `index.html` file in your web browser.
2. Select a class from the dropdown menu.
3. Start typing a student's name in the input field to see suggestions.
4. Submit the form to see the progress records.
5. Use the print button to print the records.

### Code Structure

- `index.html`: Main HTML file containing the structure of the web application.
- Inline JavaScript: Handles dynamic data loading and event handling.
- Inline CSS: Custom styles for the loader and form elements.

### JavaScript Functions

- `loadNames()`: Loads student names based on the selected class.
- `changeName()`: Resets the name input field.
- `startCountdown()`: Starts a countdown timer for visual feedback.

## Customization

To customize the student names or add new classes, edit the `studentNames` object and `averageValues` array in the JavaScript section of `index.html`.

### Example:

```javascript
var studentNames = {
    "Chandaria": ["Amanda Kimani", "Anthony Karanja", ...],
    "Riria": ["Alexander Kariuki", "Amy Chege", ...],
    "Masiyiwa": ["Ariannah Wahu", "Angeline Mugo", ...]
};

var averageValues = ["Average", "Chandaria", "Riria", "Masiyiwa"];
