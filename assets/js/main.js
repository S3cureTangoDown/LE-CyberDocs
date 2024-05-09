/*-- SCROLL TO TOP BUTTON --*/
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

window.onscroll = function () {
  var scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollPos > 20) { // Adjusted from 100 to 20 pixels
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
};

/*-- ABOUT TYPING ANIMATION --*/
const professions = ["Web Designer", "Web Developer", "USMC Veteran", "Photographer", "Runner", "Snowboarder", "Foodie", "Investigator", "Police Officer",];
let index = 0;

function typeWriter() {
  const currentProfession = professions[index];

  let charIndex = 0;

  function innerTypeWriter() {
    if (charIndex < currentProfession.length) {
      document.getElementById("typing-animation").textContent += currentProfession.charAt(charIndex);
      charIndex++;
      setTimeout(innerTypeWriter, 100);
    } else {
      setTimeout(eraseText, 1000);
    }
  }

  function eraseText() {
    if (document.getElementById("typing-animation").textContent.length > 0) {
      document.getElementById("typing-animation").textContent = document.getElementById("typing-animation").textContent.slice(0, -1);
      setTimeout(eraseText, 50);
    } else {
      index = (index + 1) % professions.length;
      setTimeout(typeWriter, 500);
    }
  }

  innerTypeWriter();
}

window.onload = function () {
  typeWriter();
};

/*-- CONTACT VALIDATION --*/
document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Validate form fields
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    alert("Please fill out all fields.");
    return;
  }

  // Additional email validation (regex or other methods) can be added here

  // If all fields are filled out, submit the form
  // You can replace this with your form submission logic (e.g., using fetch to send data to server)
  alert("Form submitted successfully!");
  document.getElementById("contactForm").reset(); // Clear form fields after submission
});

/* NARCOTIC VALUE CALCULATOR */
function calculateValue() {
  var narcotic = document.getElementById("narcotic").value;
  var weight = parseFloat(document.getElementById("weight").value);
  var weightType = document.getElementById("weightType").value;

  var narcoticData = {
    "Adderall": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Alprazolam": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Ecstasy": { "gram": 25.00, "pill": 25.00, "pound": 11350.00, "ounce": null, "kilogram": null, "mL": null },
    "Cocaine (Powder)": { "gram": 125.00, "pound": 22700.00, "ounce": 1200.00, "kilogram": 32000.00, "mL": null },
    "Cocaine (Crack)": { "gram": 123.00, "pound": 4540.00, "ounce": 1000.00, "kilogram": null, "mL": null },
    "Fentanyl": { "gram": 155.55, "pound": 70612.70, "ounce": 1500.00, "kilogram": 40000.00, "mL": null },
    "Heroin (Tan)": { "gram": 100.00, "pound": 45359.20, "ounce": null, "kilogram": null, "mL": null },
    "Heroin (White)": { "gram": 150.00, "pound": 68038.80, "ounce": null, "kilogram": null, "mL": null },
    "Heroin (Black Tar)": { "gram": 150.00, "pound": 68038.80, "ounce": null, "kilogram": null, "mL": null },
    "Hydrocodone 10mg": { "gram": 15.00, "pill": 15.00, "pound": 6810.00, "ounce": null, "kilogram": null, "mL": null },
    "Hydrocodone 30mg": { "gram": 20.00, "pill": 20.00, "pound": 9080.00, "ounce": null, "kilogram": null, "mL": null },
    "Hydrocodone 80mg": { "gram": 25.00, "pill": 25.00, "pound": 11350.00, "ounce": null, "kilogram": null, "mL": null },
    "Ketamine": { "gram": 100.00, "pill": 20.00, "pound": 45400.00, "ounce": null, "kilogram": null, "mL": null },
    "LSD": { "gram": 5.00, "pill": 10.00, "pound": 2270.00, "ounce": null, "kilogram": null, "mL": null },
    "Marijuana (Domestic)": { "gram": 4.41, "pound": 2000.00, "ounce": null, "kilogram": null, "mL": null },
    "Marijuana (Mexican)": { "gram": 2.64, "pound": 1200.00, "ounce": null, "kilogram": null, "mL": null },
    "Marijuana (Sensimilla)": { "gram": 16.00, "pound": 7256.00, "ounce": null, "kilogram": null, "mL": null },
    "MDMA": { "gram": 100.00, "pill": 20.00, "pound": 45400.00, "ounce": null, "kilogram": null, "mL": null },
    "Methamphetamine": { "gram": 330.00, "pound": 1200.00, "ounce": 800.00, "kilogram": null, "mL": null },
    "Percocet": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Psilocybin": { "gram": 9.00, "pound": 4086.00, "ounce": null, "kilogram": null, "mL": null },
    "Oxycodone 10mg": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Oxycodone 30mg": { "gram": 30.00, "pill": 30.00, "pound": 13620.00, "ounce": null, "kilogram": null, "mL": null },
    "Oxycodone 80mg": { "gram": 50.00, "pill": 50.00, "pound": 22700.00, "ounce": null, "kilogram": null, "mL": null },
    "Ritalin": { "gram": 3.50, "pill": 3.50, "pound": 1587.00, "ounce": null, "kilogram": null, "mL": null },
    "Steroids (Liquid) 1": { "ounce": 69.83, "mL": 1117.28 },
    "Steroids (Liquid) 2": { "kilogram": 2.33 },
    "Steroids (Powder)": { "ounce": 5.00, "gram": 2270.00 },
    "Suboxone": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Tetrahydrocannabinol (Gummies)": { "gram": 16.00, "pound": 7256.00, "ounce": null, "kilogram": null, "mL": null },
    "Tetrahydrocannabinol (Liquid)": { "gram": 80.00, "pound": 36320.00, "ounce": null, "kilogram": null, "mL": null },
    "Tetrahydrocannabinol (Wax)": { "gram": 80.00, "pound": 36320.00, "ounce": null, "kilogram": null, "mL": null },
    "Viagra": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null },
    "Vicodin": { "gram": 10.00, "pill": 10.00, "pound": 4540.00, "ounce": null, "kilogram": null, "mL": null }
  };

  var value = narcoticData[narcotic][weightType] * weight;
  var formattedValue = "$" + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("result").innerHTML = "Value: " + formattedValue;
}