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

/* CLICK TO COPY */
function copyToClipboard(button) {
  var copyText = button.closest('.border');
  var range = document.createRange();
  range.selectNode(copyText);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  alert("Copied the text: " + copyText.textContent.trim());
}