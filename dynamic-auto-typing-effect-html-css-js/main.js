const container = document.querySelector('.container');

const careers = ["Serial Entrepreneur", "Software Engineer", "Quant Project Manager", "Investor", "Freelancer"];

let careerIndex = 0;
let characterIndex = 0;

updateText();

function updateText() {
    container.innerHTML = `<h1>I am ${careers[careerIndex].slice(0,1) === "I" ? "an" : "a"} ${careers[careerIndex].slice(0, characterIndex)}</h1>`;

    characterIndex++;
    if (characterIndex === careers[careerIndex].length + 1) {
        careerIndex++;
        characterIndex = 0;
    }

    if (careerIndex === careers.length) {
        careerIndex = 0;
    }
    setTimeout(updateText, 400);
}
