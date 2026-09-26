/* LE Cyber-Docs — shared site script.
   Every feature checks that its elements exist first, so this file can load on every page. */

/*-- THEME TOGGLE --*/
// The initial theme is set by the inline script in each page's <head>.
(function () {
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (!button) return;

  function syncLabel() {
    var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-bs-theme", next);
    try {
      localStorage.setItem("le-theme", next);
    } catch (e) {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    syncLabel();
  });
  syncLabel();
})();

/*-- FOOTER YEAR --*/
document.querySelectorAll(".js-year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

/*-- SCROLL TO TOP BUTTON --*/
function scrollToTop() {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

(function () {
  var button = document.querySelector(".scroll-to-top");
  if (!button) return;
  button.addEventListener("click", scrollToTop);
  function update() {
    button.classList.toggle("is-visible", window.scrollY > 300);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/*-- PAGE FILTER (nav search box) --*/
// Filters this page's accordion sections (and table rows on the chart page) as you type.
(function () {
  var form = document.querySelector(".site-search");
  var input = document.getElementById("site-search");
  if (!form || !input) return;

  // Top-level accordion items outside modals, or table rows when a page has no accordions
  var items = Array.prototype.filter.call(document.querySelectorAll("main .accordion-item"), function (el) {
    return !el.closest(".modal") && !el.parentElement.closest(".accordion-item");
  });
  if (!items.length) {
    items = Array.prototype.slice.call(document.querySelectorAll("main table tbody tr"));
  }
  if (!items.length) return; // nothing to filter on this page, keep the box hidden

  form.hidden = false;
  var empty = document.createElement("p");
  empty.className = "search-empty text-center text-body-secondary py-3";
  empty.setAttribute("role", "status");
  empty.hidden = true;
  var main = document.getElementById("main");
  if (main) main.prepend(empty);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = items.find(function (el) { return !el.hidden; });
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (el) {
      var match = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
      el.hidden = !match;
      if (match) shown++;
    });
    // Hide whole sections whose items are all filtered out
    document.querySelectorAll("main .accordion").forEach(function (acc) {
      if (acc.closest(".modal") || acc.parentElement.closest(".accordion-item")) return;
      var any = acc.querySelector(":scope > .accordion-item:not([hidden])");
      var section = acc.closest(".page-section") || acc;
      section.hidden = !!q && !any;
    });
    empty.hidden = shown > 0;
    empty.textContent = shown ? "" : 'Nothing on this page matches "' + input.value.trim() + '".';
  });
})();

/*-- NARCOTIC VALUE CALCULATOR --*/
const NARCOTIC_DATA = {
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

var UNIT_LABELS = { gram: "gram", pill: "pill", pound: "pound", ounce: "ounce", kilogram: "kilogram", mL: "mL" };

function calculateValue() {
  var result = document.getElementById("result");
  var narcotic = document.getElementById("narcotic").value;
  var weight = parseFloat(document.getElementById("weight").value);
  var weightType = document.getElementById("weightType").value;
  var price = (NARCOTIC_DATA[narcotic] || {})[weightType];

  result.classList.remove("is-error", "is-value");
  if (!(weight > 0)) {
    result.textContent = "Enter an amount greater than 0.";
    result.classList.add("is-error");
    return;
  }
  if (price == null) {
    // Many drugs only have prices for some units (e.g. no "pill" price for cocaine)
    var units = Object.keys(NARCOTIC_DATA[narcotic] || {}).filter(function (u) {
      return NARCOTIC_DATA[narcotic][u] != null;
    });
    result.textContent =
      "No " + UNIT_LABELS[weightType] + " price for " + narcotic + ". Try: " +
      units.map(function (u) { return UNIT_LABELS[u] || u; }).join(", ") + ".";
    result.classList.add("is-error");
    return;
  }

  var value = price * weight;
  result.textContent =
    "Value: $" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  result.classList.add("is-value");
}

document.querySelectorAll(".js-calc-btn").forEach(function (btn) {
  btn.addEventListener("click", calculateValue);
});
// Pressing Enter in the amount box calculates too
var weightInput = document.getElementById("weight");
if (weightInput && document.querySelector(".js-calc-btn")) {
  weightInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateValue();
    }
  });
}

/*-- CLICK TO COPY --*/
function copyToClipboard(button) {
  var block = button.closest(".border");
  if (!block) return;
  // Copy the block's text without the button itself
  var clone = block.cloneNode(true);
  clone.querySelectorAll("button").forEach(function (b) { b.remove(); });
  var text = clone.textContent.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

  function done(ok) {
    var icon = button.querySelector("i");
    if (!icon) return;
    var original = icon.className;
    icon.className = ok ? "bi bi-check-lg" : "bi bi-x-lg";
    button.setAttribute("aria-label", ok ? "Copied" : "Copy failed");
    setTimeout(function () {
      icon.className = original;
      button.setAttribute("aria-label", "Copy this text");
    }, 1500);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
  } else {
    // Fallback for older browsers / non-HTTPS
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    area.remove();
    done(ok);
  }
}

/*-- SHOOTING ORDER PDF --*/
(function () {
  var button = document.getElementById("download-pdf");
  if (!button) return;
  button.addEventListener("click", function () {
    if (!window.jspdf) {
      alert("The PDF tool didn't load. Check your connection and try again.");
      return;
    }
    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    }
    var additionalSupervisors = [1, 2, 3].map(function (n) {
      return { name: val("additional_supervisors_" + n), time: val("additional_supervisors_time_" + n) };
    });

    var doc = new window.jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text("Shooting Order Request", 20, 20);

    doc.setFontSize(12);
    doc.text("1st Supervisor Ordering Statement:", 20, 40);
    doc.text("Name & Star: " + val("first_supervisor"), 20, 45);
    doc.text("Time: " + val("first_supervisor_time"), 20, 50);

    doc.text("OCIC Ordering Statement/Walkthrough:", 20, 70);
    doc.text("Name & Star: " + val("ocic_ordering"), 20, 75);
    doc.text("Time: " + val("ocic_ordering_time"), 20, 80);

    doc.text("Supervisors:", 20, 100);
    additionalSupervisors.forEach(function (s, i) {
      doc.text("Supervisor " + (i + 1) + " Name & Star: " + s.name, 20, 105 + i * 15);
      doc.text("Time: " + s.time, 20, 110 + i * 15);
    });

    doc.text("Lodge Representative:", 20, 165);
    doc.text("Name & Star: " + val("lodge_representative"), 20, 170);
    doc.text("Time: " + val("lodge_representative_time"), 20, 175);

    doc.save("Shooting_Order_Request.pdf");
  });
})();

/*-- CLEAR BUTTONS IN MODALS --*/
// Resets the fields in that modal only, instead of reloading the whole page.
document.querySelectorAll("[data-clear-modal]").forEach(function (button) {
  button.addEventListener("click", function () {
    var modal = button.closest(".modal");
    if (!modal) return;
    modal.querySelectorAll("input, select, textarea").forEach(function (el) {
      // Back to how the page first loaded
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = el.defaultChecked;
      } else if (el.tagName === "SELECT") {
        Array.prototype.forEach.call(el.options, function (o) { o.selected = o.defaultSelected; });
      } else {
        el.value = el.defaultValue;
      }
    });
  });
});

/*-- CONTACT FORMS (Formspree) --*/
// Sends the form in the background and shows the result on the page.
// Without JavaScript the form still posts to Formspree normally.
document.querySelectorAll(".js-contact-form").forEach(function (form) {
  var status = form.querySelector(".form-status");
  var button = form.querySelector('button[type="submit"]');

  function show(kind, text) {
    status.className = "form-status mt-3 alert alert-" + kind;
    status.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      show("warning", "The contact form isn't set up yet. Please try again later.");
      return;
    }

    button.disabled = true;
    show("info", "Sending…");
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            var msg = data.errors && data.errors.length
              ? data.errors.map(function (er) { return er.message; }).join(" ")
              : "Something went wrong.";
            throw new Error(msg);
          }
        });
      })
      .then(function () {
        form.reset();
        form.classList.remove("was-validated");
        show("success", "Thanks! Your message was sent.");
      })
      .catch(function (err) {
        show("danger", "Your message wasn't sent. " + err.message + " Please try again.");
      })
      .then(function () {
        button.disabled = false;
      });
  });
});

/*-- LOGIN / SIGN UP --*/
// This is a static site with no server, so there is no real account system yet.
// These handlers validate the form and never send the password anywhere.
(function () {
  var login = document.getElementById("login-form");
  if (login) {
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      login.classList.add("was-validated");
      if (login.checkValidity()) window.location.href = "forms.html";
    });
  }

  var signup = document.getElementById("signup-form");
  if (signup) {
    var pw = document.getElementById("password");
    var confirmPw = document.getElementById("confirmPassword");
    function checkMatch() {
      confirmPw.setCustomValidity(confirmPw.value && confirmPw.value !== pw.value ? "Passwords don't match" : "");
    }
    pw.addEventListener("input", checkMatch);
    confirmPw.addEventListener("input", checkMatch);
    signup.addEventListener("submit", function (e) {
      e.preventDefault();
      checkMatch();
      signup.classList.add("was-validated");
      if (!signup.checkValidity()) return;
      var status = document.getElementById("signup-status");
      status.textContent = "Online sign-up isn't available yet. Contact the site admin for access.";
      status.classList.remove("d-none");
    });
  }

  document.querySelectorAll(".js-toggle-password").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("aria-controls"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.querySelector("i").className = show ? "bi bi-eye-slash" : "bi bi-eye";
    });
  });
})();
