/*-- SCROLL TO TOP BUTTON --*/
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.onscroll = function () {
  var scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollToTopBtn = document.querySelector(".scroll-to-top");
  if (scrollPos > 20) {
    // Adjusted from 100 to 20 pixels
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

/*-- LOGIN REGISTER MODAL --*/
document.addEventListener("DOMContentLoaded", function () {
  /*-- NAV REGISTER/LOGIN REDIRECT--*/
  document
    .getElementById("loginRedirect")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      $("#registerModal").modal("hide"); // Hide the register modal if it's open
      $("#loginModal").modal("show"); // Show the login modal
    });

  document
    .getElementById("registerRedirect")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      $("#loginModal").modal("hide"); // Hide the login modal if it's open
      $("#registerModal").modal("show"); // Show the register modal
    });
});

/*-- ABOUT TYPING ANIMATION FOR t3Rminal_cmd --*/
const terminalCmdProfessions = [
  "Web Designer",
  "Web Developer",
  "USMC Veteran",
  "Photographer",
  "Runner",
  "Snowboarder",
  "Foodie",
  "Investigator",
  "Police Officer",
];
let terminalCmdIndex = 0;

function terminalCmdTypeWriter() {
  const currentProfession = terminalCmdProfessions[terminalCmdIndex];

  let charIndex = 0;

  function innerTypeWriter() {
    if (charIndex < currentProfession.length) {
      document.getElementById("typing-animation").textContent +=
        currentProfession.charAt(charIndex);
      charIndex++;
      setTimeout(innerTypeWriter, 100);
    } else {
      setTimeout(terminalCmdEraseText, 1000);
    }
  }

  function terminalCmdEraseText() {
    if (document.getElementById("typing-animation").textContent.length > 0) {
      document.getElementById("typing-animation").textContent = document
        .getElementById("typing-animation")
        .textContent.slice(0, -1);
      setTimeout(terminalCmdEraseText, 50);
    } else {
      terminalCmdIndex = (terminalCmdIndex + 1) % terminalCmdProfessions.length;
      setTimeout(terminalCmdTypeWriter, 500);
    }
  }

  innerTypeWriter();
}

/*-- ABOUT TYPING ANIMATION FOR BAO-g0ddess --*/
const baoGoddessProfessions = [
  "DUI Expert",
  "Cyber Analyst",
  "Police Officer",
  "Air Force Veteran",
  "Snowboarder",
  "Gardener",
  "PC Gamer",
];
let baoGoddessIndex = 0;

function baoGoddessTypeWriter() {
  const currentProfession = baoGoddessProfessions[baoGoddessIndex];

  let charIndex = 0;

  function innerTypeWriter() {
    if (charIndex < currentProfession.length) {
      document.getElementById("typing-animation-bao").textContent +=
        currentProfession.charAt(charIndex);
      charIndex++;
      setTimeout(innerTypeWriter, 100);
    } else {
      setTimeout(baoGoddessEraseText, 1000);
    }
  }

  function baoGoddessEraseText() {
    if (
      document.getElementById("typing-animation-bao").textContent.length > 0
    ) {
      document.getElementById("typing-animation-bao").textContent = document
        .getElementById("typing-animation-bao")
        .textContent.slice(0, -1);
      setTimeout(baoGoddessEraseText, 50);
    } else {
      baoGoddessIndex = (baoGoddessIndex + 1) % baoGoddessProfessions.length;
      setTimeout(baoGoddessTypeWriter, 500);
    }
  }

  innerTypeWriter();
}

window.onload = function () {
  terminalCmdTypeWriter();
  baoGoddessTypeWriter();
};

/*-- ABOUT TYPING ANIMATION FOR Just!ce_s33ker --*/
const justiceSeekerProfessions = [
  "Lawyer",
  "Skier",
  "Navy Veteran",
  "Outdoorsman",
];
let justiceSeekerIndex = 0;

function justiceSeekerTypeWriter() {
  const currentProfession = justiceSeekerProfessions[justiceSeekerIndex];

  let charIndex = 0;

  function innerTypeWriter() {
    if (charIndex < currentProfession.length) {
      document.getElementById("typing-animation-Just!ce").textContent +=
        currentProfession.charAt(charIndex);
      charIndex++;
      setTimeout(innerTypeWriter, 100);
    } else {
      setTimeout(justiceSeekerEraseText, 1000);
    }
  }

  function justiceSeekerEraseText() {
    if (
      document.getElementById("typing-animation-Just!ce").textContent.length > 0
    ) {
      document.getElementById("typing-animation-Just!ce").textContent = document
        .getElementById("typing-animation-Just!ce")
        .textContent.slice(0, -1);
      setTimeout(justiceSeekerEraseText, 50);
    } else {
      justiceSeekerIndex =
        (justiceSeekerIndex + 1) % justiceSeekerProfessions.length;
      setTimeout(justiceSeekerTypeWriter, 500);
    }
  }

  innerTypeWriter();
}

window.onload = function () {
  terminalCmdTypeWriter();
  baoGoddessTypeWriter();
  justiceSeekerTypeWriter(); // Added here
};

/* NARCOTIC VALUE CALCULATOR */
function calculateValue() {
  var narcotic = document.getElementById("narcotic").value;
  var weight = parseFloat(document.getElementById("weight").value);
  var weightType = document.getElementById("weightType").value;

  var narcoticData = {
    Adderall: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Alprazolam: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Ecstasy: {
      gram: 25.0,
      pill: 25.0,
      pound: 11350.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Cocaine (Powder)": {
      gram: 125.0,
      pound: 22700.0,
      ounce: 1200.0,
      kilogram: 32000.0,
      mL: null,
    },
    "Cocaine (Crack)": {
      gram: 123.0,
      pound: 4540.0,
      ounce: 1000.0,
      kilogram: null,
      mL: null,
    },
    Fentanyl: {
      gram: 155.55,
      pound: 70612.7,
      ounce: 1500.0,
      kilogram: 40000.0,
      mL: null,
    },
    "Heroin (Tan)": {
      gram: 100.0,
      pound: 45359.2,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Heroin (White)": {
      gram: 150.0,
      pound: 68038.8,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Heroin (Black Tar)": {
      gram: 150.0,
      pound: 68038.8,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Hydrocodone 10mg": {
      gram: 15.0,
      pill: 15.0,
      pound: 6810.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Hydrocodone 30mg": {
      gram: 20.0,
      pill: 20.0,
      pound: 9080.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Hydrocodone 80mg": {
      gram: 25.0,
      pill: 25.0,
      pound: 11350.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Ketamine: {
      gram: 100.0,
      pill: 20.0,
      pound: 45400.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    LSD: {
      gram: 5.0,
      pill: 10.0,
      pound: 2270.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Marijuana (Domestic)": {
      gram: 4.41,
      pound: 2000.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Marijuana (Mexican)": {
      gram: 2.64,
      pound: 1200.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Marijuana (Sensimilla)": {
      gram: 16.0,
      pound: 7256.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    MDMA: {
      gram: 100.0,
      pill: 20.0,
      pound: 45400.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Methamphetamine: {
      gram: 330.0,
      pound: 1200.0,
      ounce: 800.0,
      kilogram: null,
      mL: null,
    },
    Percocet: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Psilocybin: {
      gram: 9.0,
      pound: 4086.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Oxycodone 10mg": {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Oxycodone 30mg": {
      gram: 30.0,
      pill: 30.0,
      pound: 13620.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Oxycodone 80mg": {
      gram: 50.0,
      pill: 50.0,
      pound: 22700.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Ritalin: {
      gram: 3.5,
      pill: 3.5,
      pound: 1587.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Steroids (Liquid) 1": { ounce: 69.83, mL: 1117.28 },
    "Steroids (Liquid) 2": { kilogram: 2.33 },
    "Steroids (Powder)": { ounce: 5.0, gram: 2270.0 },
    Suboxone: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Tetrahydrocannabinol (Gummies)": {
      gram: 16.0,
      pound: 7256.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Tetrahydrocannabinol (Liquid)": {
      gram: 80.0,
      pound: 36320.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    "Tetrahydrocannabinol (Wax)": {
      gram: 80.0,
      pound: 36320.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Viagra: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
    Vicodin: {
      gram: 10.0,
      pill: 10.0,
      pound: 4540.0,
      ounce: null,
      kilogram: null,
      mL: null,
    },
  };

  var value = narcoticData[narcotic][weightType] * weight;
  var formattedValue =
    "$" +
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  document.getElementById("result").innerHTML = "Value: " + formattedValue;
}

/* CLEAR PAGE BUTTON */
function reloadPage1() {
  location.reload();
}

function reloadPage2() {
  location.reload();
}

const refreshModalButton1 = document.getElementById("refreshModalButton1");
const refreshModalButton2 = document.getElementById("refreshModalButton2");

refreshModalButton1.addEventListener("click", reloadPage1);
refreshModalButton2.addEventListener("click", reloadPage2);
