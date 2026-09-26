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
    return !el.closest(".modal") && !el.parentElement.closest(".accordion-item") && !el.hasAttribute("data-placeholder");
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
// Custom layout used by both "Download PDF" and "Email PDF" (see PDF_BUILDERS below).
function buildShootingOrderPdf() {
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
  doc.setFontSize(9);
  doc.text("Generated " + new Date().toLocaleString(), 20, 26);

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

  var date = new Date().toISOString().slice(0, 10);
  return { doc: doc, filename: "Shooting_Order_Request_" + date + ".pdf", subject: "Shooting Order Request — " + date };
}

var PDF_BUILDERS = { shooting: buildShootingOrderPdf };

(function () {
  var button = document.getElementById("download-pdf");
  if (!button) return;
  button.addEventListener("click", function () {
    if (!window.jspdf) {
      alert("The PDF tool didn't load. Check your connection and try again.");
      return;
    }
    var pdf = buildShootingOrderPdf();
    pdf.doc.save(pdf.filename);
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
    modal.querySelectorAll("[data-sfst-clue], [data-sfst-cannot]").forEach(function (el) {
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
});

/*-- SFST SCORING --*/
// Counts checked clues into each test's score box. "Can't perform" scores the maximum
// (NHTSA: record as if all clues were present). The officer can still change the number.
(function () {
  var selects = document.querySelectorAll("[data-sfst-score]");
  if (!selects.length) return;

  function update(test) {
    var select = document.querySelector('[data-sfst-score="' + test + '"]');
    if (!select) return;
    var max = parseInt(select.getAttribute("data-max"), 10);
    var cannot = document.querySelector('[data-sfst-cannot="' + test + '"]');
    var count = document.querySelectorAll('[data-sfst-clue="' + test + '"]:checked').length;
    var score = cannot && cannot.checked ? max : Math.min(count, max);
    select.value = String(score);
    showVerdict(select);
  }

  function showVerdict(select) {
    var test = select.getAttribute("data-sfst-score");
    var decision = parseInt(select.getAttribute("data-decision"), 10);
    var verdict = document.querySelector('[data-sfst-verdict="' + test + '"]');
    if (!verdict) return;
    var score = parseInt(select.value, 10) || 0;
    var reached = score >= decision;
    verdict.textContent = reached
      ? "Decision point reached (" + score + " of " + decision + ")."
      : "Below decision point (" + score + " of " + decision + ").";
    verdict.classList.toggle("is-reached", reached);
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    var test = t.getAttribute && (t.getAttribute("data-sfst-clue") || t.getAttribute("data-sfst-cannot"));
    if (test) update(test);
    if (t.hasAttribute && t.hasAttribute("data-sfst-score")) showVerdict(t);
  });
  selects.forEach(function (sel) { update(sel.getAttribute("data-sfst-score")); });
})();

/*-- EITHER-OR CHECKBOXES (Pass / Fail) --*/
document.addEventListener("change", function (e) {
  var t = e.target;
  var group = t.getAttribute && t.getAttribute("data-exclusive");
  if (!group || !t.checked) return;
  document.querySelectorAll('[data-exclusive="' + group + '"]').forEach(function (other) {
    if (other !== t) other.checked = false;
  });
});

/*-- "NOW" TIME BUTTONS --*/
// Fills the time field next to the button: "1432 Hrs" for text fields, 14:32 for time pickers.
function pad2(n) { return (n < 10 ? "0" : "") + n; }

document.addEventListener("click", function (e) {
  var btn = e.target.closest && e.target.closest(".js-now");
  if (!btn) return;
  // The field right before the button (a row can also hold a name box, as in Shooting Order)
  var input = btn.previousElementSibling;
  if (!input || input.tagName !== "INPUT") return;
  var d = new Date();
  input.value = input.type === "time"
    ? pad2(d.getHours()) + ":" + pad2(d.getMinutes())
    : pad2(d.getHours()) + pad2(d.getMinutes()) + " Hrs";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
});

/*-- DATE FIELDS THAT DEFAULT TO TODAY --*/
document.querySelectorAll("input[type=date][data-default-today]").forEach(function (el) {
  var d = new Date();
  var today = d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  el.defaultValue = today; // "Clear Page" puts it back to today
  if (!el.value) el.value = today;
});

// Title for a printable/emailable section: a modal's title, or data-print-title on other sections
function sectionTitle(el) {
  var t = el.getAttribute("data-print-title");
  var titleEl = el.querySelector(".modal-title");
  return (t || (titleEl ? titleEl.textContent : "") || "Printout").replace(/\s+/g, " ").trim();
}

/*-- PRINT A MODAL --*/
// Prints just that modal: every section expanded, answers as filled in, light colors,
// with a small header. Use the browser's "Save as PDF" printer to save a copy.
(function () {
  function printModal(modal) {
    var root = document.documentElement;
    var theme = root.getAttribute("data-bs-theme");
    var marked = [];
    for (var el = modal.parentElement; el && el !== root; el = el.parentElement) {
      el.classList.add("print-ancestor");
      marked.push(el);
    }
    var header = document.createElement("div");
    header.className = "print-header";
    var h = document.createElement("h1");
    h.textContent = "LE Cyber-Docs — " + sectionTitle(modal);
    var meta = document.createElement("p");
    meta.textContent = "Printed " + new Date().toLocaleString();
    header.appendChild(h);
    header.appendChild(meta);
    var content = modal.querySelector(".modal-content") || modal;
    content.insertBefore(header, content.firstChild);

    root.setAttribute("data-bs-theme", "light");
    document.body.classList.add("printing-modal");
    modal.classList.add("print-target");

    var done = false;
    function cleanup() {
      if (done) return;
      done = true;
      header.remove();
      modal.classList.remove("print-target");
      document.body.classList.remove("printing-modal");
      marked.forEach(function (m) { m.classList.remove("print-ancestor"); });
      if (theme) root.setAttribute("data-bs-theme", theme);
    }
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    // Some mobile browsers never fire afterprint; restore on the next tap or key press instead
    setTimeout(function () {
      document.addEventListener("pointerdown", cleanup, { once: true });
      document.addEventListener("keydown", cleanup, { once: true });
    }, 0);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-print-modal]");
    if (!btn) return;
    var modal = btn.closest(".modal, [data-printable]");
    if (modal) printModal(modal);
  });
})();

/*-- EMAIL A MODAL AS PDF --*/
// Builds a PDF of the modal (answers as filled in) and hands it to the device:
// phones/most desktops open the share sheet with the PDF attached; other browsers
// download the PDF and open a new email to the department address.
// Nothing is sent through this website or any outside service.
var DEPARTMENT_EMAIL = ""; // optional default "Send to" address; each device can change and remember its own

function openMailto(url) {
  window.location.href = url;
}

(function () {
  var STORE_KEY = "le-dept-email";

  function savedEmail() {
    try {
      return localStorage.getItem(STORE_KEY) || DEPARTMENT_EMAIL;
    } catch (e) {
      return DEPARTMENT_EMAIL;
    }
  }

  function slug(text) {
    return text.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function fieldValue(root, id) {
    var el = id && root.querySelector("#" + id);
    return el ? el.value.trim() : "";
  }

  // Turn the modal into plain text lines: checkboxes as [X] / [ ], fields as their values,
  // every section expanded. Returns { lines, headings }.
  function modalToLines(modal) {
    var content = modal.querySelector(".modal-content");
    var clone = content.cloneNode(true); // input values and checks are copied with the clone
    clone.querySelectorAll(".modal-header, .modal-footer, .btn, .email-panel, .report-details, .print-header, [hidden], .visually-hidden")
      .forEach(function (el) { el.remove(); });

    var headings = [];
    clone.querySelectorAll(".accordion-button").forEach(function (btn) {
      var text = btn.textContent.replace(/\s+/g, " ").trim().toUpperCase();
      headings.push(text);
      var div = document.createElement("div");
      div.textContent = text;
      btn.replaceWith(div);
    });
    clone.querySelectorAll("input, select, textarea").forEach(function (el) {
      var span = document.createElement("span");
      if (el.type === "checkbox" || el.type === "radio") {
        span.textContent = el.checked ? "[X] " : "[ ] ";
      } else {
        // Answers go on their own line under the label
        var opt = el.tagName === "SELECT" ? el.options[el.selectedIndex] : null;
        var val = el.tagName === "SELECT" ? (opt ? opt.textContent.trim() : "") : el.value.trim();
        span.textContent = "\u00bb " + (val || "________");
        span.style.display = "block";
      }
      el.replaceWith(span);
    });

    // innerText needs the clone on the page (laid out) to keep line breaks
    var holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText = "position:fixed;left:-10000px;top:0;width:700px;";
    holder.appendChild(clone);
    clone.querySelectorAll(".accordion-collapse, .collapse").forEach(function (el) {
      el.style.display = "block";
      el.style.height = "auto";
    });
    document.body.appendChild(holder);
    var text = clone.innerText;
    holder.remove();

    var lines = text.replace(/\t+/g, "  |  ").split("\n")
      .map(function (l) { return l.replace(/\s+/g, " ").trim(); })
      .filter(function (l, i, arr) { return l || (i > 0 && arr[i - 1]); }); // collapse blank runs
    return { lines: lines, headings: headings };
  }

  function buildPdf(modal) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: "pt", format: "letter" });
    var margin = 48;
    var width = doc.internal.pageSize.getWidth() - margin * 2;
    var bottom = doc.internal.pageSize.getHeight() - margin;
    var y = margin;

    function write(text, size, bold, gap) {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.splitTextToSize(text, width).forEach(function (line) {
        if (y > bottom) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += size * 1.35;
      });
      y += gap || 0;
    }

    var title = sectionTitle(modal);
    write("LE Cyber-Docs — " + title, 16, true, 2);
    write("Generated " + new Date().toLocaleString(), 9, false, 8);

    var details = modal.querySelector(".report-details");
    var info = {};
    if (details) {
      details.querySelectorAll("input").forEach(function (input) {
        var label = details.querySelector('label[for="' + input.id + '"]');
        var key = label ? label.textContent.trim() : input.id;
        info[key] = input.value.trim();
        write(key + ": " + (input.value.trim() || "________"), 10, false);
      });
      y += 8;
    }

    var result = modalToLines(modal);
    result.lines.forEach(function (line) {
      var isHeading = result.headings.indexOf(line) !== -1;
      if (isHeading) y += 6;
      write(line || " ", isHeading ? 11 : 10, isHeading, isHeading ? 2 : 0);
    });

    var caseNo = info["RD / Case #"] || "";
    var date = info["Date"] || new Date().toISOString().slice(0, 10);
    var filename = [slug(title), slug(caseNo), date].filter(Boolean).join("_") + ".pdf";
    var subject = title + (caseNo ? " — RD " + caseNo : "") + " — " + date;
    return { blob: doc.output("blob"), filename: filename, subject: subject };
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  function send(modal, panel) {
    var status = panel.querySelector(".email-status");
    var input = panel.querySelector("input[type=email]");
    function say(kind, text) {
      status.className = "email-status small mt-2 text-" + kind;
      status.textContent = text;
    }
    if (input.value && !input.checkValidity()) {
      say("danger", "That email address doesn't look right.");
      return;
    }
    var to = input.value.trim();
    input.defaultValue = to;
    try {
      localStorage.setItem(STORE_KEY, to);
    } catch (e) {}
    if (!window.jspdf) {
      say("danger", "The PDF tool didn't load. Check your connection and try again.");
      return;
    }

    var builder = PDF_BUILDERS[modal.getAttribute("data-pdf-builder")];
    var pdf;
    if (builder) {
      var custom = builder();
      pdf = { blob: custom.doc.output("blob"), filename: custom.filename, subject: custom.subject };
    } else {
      pdf = buildPdf(modal);
    }
    var body = "Attached: " + pdf.filename + "\n\nSent from LE Cyber-Docs.";
    var file = typeof File === "function" ? new File([pdf.blob], pdf.filename, { type: "application/pdf" }) : null;

    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: pdf.subject,
        text: (to ? "Send to: " + to + "\n" : "") + body,
      }).then(function () {
        say("success", "Shared. If you picked your mail app, check the email was sent.");
      }, function (err) {
        if (err && err.name === "AbortError") {
          say("body-secondary", "Share cancelled.");
        } else {
          download(pdf.blob, pdf.filename);
          say("warning", "Couldn't open the share sheet, so the PDF was downloaded instead.");
        }
      });
      if (to) say("body-secondary", "Pick your mail app and send it to " + to + ".");
      return;
    }

    // No file sharing here: save the PDF and start an email the officer attaches it to
    download(pdf.blob, pdf.filename);
    if (to) {
      openMailto("mailto:" + encodeURIComponent(to).replace(/%40/g, "@") +
        "?subject=" + encodeURIComponent(pdf.subject) +
        "&body=" + encodeURIComponent("Please find attached " + pdf.filename + " (downloaded to this device).\n\nSent from LE Cyber-Docs."));
      say("success", "PDF downloaded. Attach " + pdf.filename + " to the email that just opened.");
    } else {
      say("success", "PDF downloaded as " + pdf.filename + ". Attach it to an email.");
    }
  }

  function panelFor(modal) {
    var panel = modal.querySelector(".email-panel");
    if (panel) return panel;
    panel = document.createElement("form");
    panel.className = "email-panel border-top px-3 py-3";
    panel.noValidate = true;
    var id = (modal.id || "section") + "-email-to";
    panel.innerHTML =
      '<label class="form-label small fw-semibold mb-1" for="' + id + '">Send to (department email)</label>' +
      '<div class="input-group">' +
      '<input type="email" class="form-control" id="' + id + '" placeholder="records@department.gov" autocomplete="email" inputmode="email">' +
      '<button type="submit" class="btn btn-primary"><i class="bi bi-send me-1" aria-hidden="true"></i>Send PDF</button>' +
      "</div>" +
      '<p class="small text-body-secondary mb-0 mt-2">Opens your share sheet or mail app with the PDF. Nothing is sent through this website. The address is remembered on this device.</p>' +
      '<p class="email-status small mt-2 mb-0" role="status" aria-live="polite"></p>';
    var emailInput = panel.querySelector("input");
    emailInput.value = emailInput.defaultValue = savedEmail(); // "Clear Page" keeps the address
    panel.addEventListener("submit", function (e) {
      e.preventDefault();
      send(modal, panel);
    });
    var footer = modal.querySelector(".modal-footer");
    if (footer) footer.before(panel);
    else modal.querySelector("[data-email-anchor]").after(panel);
    return panel;
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-email-modal]");
    if (!btn) return;
    var modal = btn.closest(".modal, [data-printable]");
    if (!modal) return;
    var panel = panelFor(modal);
    panel.hidden = false;
    var input = panel.querySelector("input");
    input.focus();
    panel.scrollIntoView({ block: "nearest" });
  });
})();

/*-- CHEAT SHEETS (Incident Reporting, UCR, Fueling Stations) --*/
// Search box + category chips filter the cards; tapping a code card copies the code.
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
  }
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
  return Promise.resolve(ok);
}

document.querySelectorAll(".cheat").forEach(function (sheet) {
  var input = sheet.querySelector(".cheat-search");
  var chips = sheet.querySelectorAll(".cheat-chip");
  var groups = sheet.querySelectorAll(".cheat-group");
  var empty = sheet.querySelector(".cheat-empty");
  var category = "all";

  function apply() {
    var q = input.value.trim().toLowerCase();
    var shownTotal = 0;
    groups.forEach(function (group) {
      var inCat = category === "all" || group.getAttribute("data-cat") === category;
      var shown = 0;
      group.querySelectorAll("li").forEach(function (item) {
        var match = inCat && (!q || item.textContent.toLowerCase().indexOf(q) !== -1);
        item.hidden = !match;
        if (match) shown++;
      });
      group.hidden = shown === 0;
      shownTotal += shown;
    });
    empty.hidden = shownTotal > 0;
  }

  input.addEventListener("input", apply);
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      category = chip.getAttribute("data-cat");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      apply();
    });
  });

  sheet.addEventListener("click", function (e) {
    var card = e.target.closest(".code-card");
    if (!card) return;
    var code = card.getAttribute("data-copy");
    copyText(code).then(function (ok) {
      if (!ok) return;
      var desc = card.querySelector(".code-card-desc");
      var original = desc.textContent;
      card.classList.add("is-copied");
      desc.textContent = "Copied " + code;
      setTimeout(function () {
        card.classList.remove("is-copied");
        desc.textContent = original;
      }, 1200);
    });
  });

  // Start fresh each time the sheet opens
  var modal = sheet.closest(".modal");
  if (modal) {
    modal.addEventListener("show.bs.modal", function () {
      input.value = "";
      category = "all";
      chips.forEach(function (c) {
        var on = c.getAttribute("data-cat") === "all";
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      apply();
    });
  }
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
