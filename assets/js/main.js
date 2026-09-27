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

/*-- NARCOTIC VALUE CALCULATOR --*/
// Street values (HIDTA 2022), per unit. The chart tables and the calculator are both built
// from this list, so edit prices here only.
//   cat:    section the drug is listed under
//   verify: units whose price looks wrong but couldn't be corrected without new data
// Pound prices that are just the gram price x 454 are marked as estimates automatically.
const NARCOTIC_CATEGORIES = [
  "Cocaine", "Heroin", "Fentanyl", "Methamphetamine", "Marijuana & THC",
  "Pills (per pill)", "Hallucinogens & Club Drugs", "Steroids",
];
const NARCOTIC_DATA = {
  "Cocaine (Powder)": { cat: "Cocaine", gram: 125.0, ounce: 1200.0, pound: 22700.0, kilogram: 32000.0 },
  "Cocaine (Crack)": { cat: "Cocaine", gram: 123.0, ounce: 1000.0, pound: 4540.0, verify: ["pound"] },
  "Heroin (Tan)": { cat: "Heroin", gram: 100.0, pound: 45359.2 },
  "Heroin (White)": { cat: "Heroin", gram: 150.0, pound: 68038.8 },
  "Heroin (Black Tar)": { cat: "Heroin", gram: 150.0, pound: 68038.8 },
  Fentanyl: { cat: "Fentanyl", gram: 155.55, ounce: 1500.0, pound: 70612.7, kilogram: 40000.0, verify: ["pound"] },
  Methamphetamine: { cat: "Methamphetamine", gram: 330.0, ounce: 800.0, pound: 1200.0, verify: ["gram"] },
  "Marijuana (Domestic)": { cat: "Marijuana & THC", gram: 4.41, pound: 2000.0 },
  "Marijuana (Mexican)": { cat: "Marijuana & THC", gram: 2.64, pound: 1200.0 },
  "Marijuana (Sinsemilla)": { cat: "Marijuana & THC", gram: 16.0, pound: 7256.0 },
  "Tetrahydrocannabinol (Gummies)": { cat: "Marijuana & THC", gram: 16.0, pound: 7256.0 },
  "Tetrahydrocannabinol (Liquid)": { cat: "Marijuana & THC", gram: 80.0, pound: 36320.0 },
  "Tetrahydrocannabinol (Wax)": { cat: "Marijuana & THC", gram: 80.0, pound: 36320.0 },
  Adderall: { cat: "Pills (per pill)", pill: 10.0 },
  Alprazolam: { cat: "Pills (per pill)", pill: 10.0 },
  Ecstasy: { cat: "Pills (per pill)", pill: 25.0 },
  "Hydrocodone 10mg": { cat: "Pills (per pill)", pill: 15.0 },
  "Hydrocodone 30mg": { cat: "Pills (per pill)", pill: 20.0 },
  "Hydrocodone 80mg": { cat: "Pills (per pill)", pill: 25.0, verify: ["pill"] },
  "Oxycodone 10mg": { cat: "Pills (per pill)", pill: 10.0 },
  "Oxycodone 30mg": { cat: "Pills (per pill)", pill: 30.0 },
  "Oxycodone 80mg": { cat: "Pills (per pill)", pill: 50.0 },
  Percocet: { cat: "Pills (per pill)", pill: 10.0 },
  Ritalin: { cat: "Pills (per pill)", pill: 3.5 },
  Suboxone: { cat: "Pills (per pill)", pill: 10.0 },
  Viagra: { cat: "Pills (per pill)", pill: 10.0 },
  Vicodin: { cat: "Pills (per pill)", pill: 10.0 },
  Ketamine: { cat: "Hallucinogens & Club Drugs", gram: 100.0, pill: 20.0, pound: 45400.0 },
  LSD: { cat: "Hallucinogens & Club Drugs", gram: 5.0, pill: 10.0, pound: 2270.0, verify: ["gram"] },
  MDMA: { cat: "Hallucinogens & Club Drugs", gram: 100.0, pill: 20.0, pound: 45400.0 },
  Psilocybin: { cat: "Hallucinogens & Club Drugs", gram: 9.0, pound: 4086.0 },
  // The old list had these under the wrong units: $69.83 x 16 = $1,117.28 (ounce -> pound)
  // and $5 x 454 = $2,270 (gram -> pound).
  "Steroids (Liquid) 1": { cat: "Steroids", ounce: 69.83, pound: 1117.28 },
  "Steroids (Liquid) 2": { cat: "Steroids", kilogram: 2.33, verify: ["kilogram"] },
  "Steroids (Powder)": { cat: "Steroids", gram: 5.0, pound: 2270.0 },
};

var UNIT_LABELS = { gram: "gram", pill: "pill", ounce: "ounce", pound: "pound", kilogram: "kilogram", mL: "mL" };
var UNIT_ORDER = ["gram", "pill", "ounce", "pound", "kilogram", "mL"];

function priceUnits(drug) {
  var d = NARCOTIC_DATA[drug] || {};
  return UNIT_ORDER.filter(function (u) { return typeof d[u] === "number"; });
}

// A pound price that is just the gram price x 454 is an estimate, not a bulk price
function isEstimate(d, unit) {
  return unit === "pound" && d.gram && d.pound && Math.abs(d.pound / d.gram - 453.6) < 2;
}

function money(v) {
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateValue() {
  var result = document.getElementById("result");
  var narcotic = document.getElementById("narcotic").value;
  var weight = parseFloat(document.getElementById("weight").value);
  var weightType = document.getElementById("weightType").value;
  var d = NARCOTIC_DATA[narcotic] || {};
  var price = d[weightType];

  result.classList.remove("is-error", "is-value");
  if (!(weight > 0)) {
    result.textContent = "Enter an amount greater than 0.";
    result.classList.add("is-error");
    return;
  }
  if (typeof price !== "number") {
    result.textContent = "No " + UNIT_LABELS[weightType] + " price for " + narcotic + ". Try: " +
      priceUnits(narcotic).map(function (u) { return UNIT_LABELS[u]; }).join(", ") + ".";
    result.classList.add("is-error");
    return;
  }

  var text = "Value: " + money(price * weight);
  if (isEstimate(d, weightType)) text += " (estimate: gram price × 454)";
  if (d.verify && d.verify.indexOf(weightType) !== -1) text += " (price needs verification)";
  result.textContent = text;
  result.classList.add("is-value");
}

// Fill the calculator's drug list from NARCOTIC_DATA and only offer units that have a price
(function () {
  var drugSelect = document.getElementById("narcotic");
  var unitSelect = document.getElementById("weightType");
  if (!drugSelect || !unitSelect) return;

  drugSelect.innerHTML = "";
  NARCOTIC_CATEGORIES.forEach(function (cat) {
    var group = document.createElement("optgroup");
    group.label = cat;
    Object.keys(NARCOTIC_DATA).forEach(function (name) {
      if (NARCOTIC_DATA[name].cat !== cat) return;
      var opt = document.createElement("option");
      opt.value = opt.textContent = name;
      group.appendChild(opt);
    });
    drugSelect.appendChild(group);
  });

  function syncUnits() {
    var previous = unitSelect.value;
    var units = priceUnits(drugSelect.value);
    unitSelect.innerHTML = "";
    units.forEach(function (u) {
      var opt = document.createElement("option");
      opt.value = u;
      opt.textContent = u === "mL" ? "mL" : u.charAt(0).toUpperCase() + u.slice(1);
      unitSelect.appendChild(opt);
    });
    if (units.indexOf(previous) !== -1) unitSelect.value = previous;
  }
  drugSelect.addEventListener("change", syncUnits);
  syncUnits();
})();

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

/*-- STREET VALUE TABLES --*/
// Built from NARCOTIC_DATA wherever the page has <div data-value-chart></div>.
document.querySelectorAll("[data-value-chart]").forEach(function (box) {
  function unitLabel(u) {
    return u === "mL" ? "mL" : u.charAt(0).toUpperCase() + u.slice(1);
  }
  var html = "";
  NARCOTIC_CATEGORIES.forEach(function (cat) {
    var names = Object.keys(NARCOTIC_DATA).filter(function (n) { return NARCOTIC_DATA[n].cat === cat; });
    if (!names.length) return;
    var units = UNIT_ORDER.filter(function (u) {
      return names.some(function (n) { return typeof NARCOTIC_DATA[n][u] === "number"; });
    });
    html += '<section class="value-group"><h3 class="value-group-title">' + cat + "</h3>" +
      '<div class="table-responsive"><table class="table table-bordered table-striped align-middle value-table"><thead><tr><th scope="col">Drug</th>' +
      units.map(function (u) { return '<th scope="col">' + unitLabel(u) + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    names.forEach(function (n) {
      var d = NARCOTIC_DATA[n];
      var priced = units.filter(function (u) { return typeof d[u] === "number"; }).length;
      html += "<tr" + (priced === 1 ? ' class="value-single"' : "") + '><th scope="row">' + n + "</th>" + units.map(function (u) {
        if (typeof d[u] !== "number") return '<td class="value-none text-body-secondary">—</td>';
        var cell = money(d[u]);
        if (isEstimate(d, u)) cell = '<span class="value-est" title="Estimate: gram price × 454">≈ ' + cell + "</span>";
        if (d.verify && d.verify.indexOf(u) !== -1) cell += ' <span class="badge text-bg-warning value-verify" title="Looks inconsistent; needs a current price">verify</span>';
        return '<td data-label="' + unitLabel(u) + '">' + cell + "</td>";
      }).join("") + "</tr>";
    });
    html += "</tbody></table></div></section>";
  });
  html += '<p class="value-footnote small text-body-secondary">Source: HIDTA 2022. ' +
    "≈ = estimate (gram price × 454), usually higher than real bulk prices. " +
    '<span class="badge text-bg-warning">verify</span> = price looks inconsistent and needs a current figure.</p>';
  box.innerHTML = html;
});

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
// Search box + category dropdown filter the cards; tapping a code card copies the code.
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
  var filter = sheet.querySelector(".cheat-filter");
  var groups = sheet.querySelectorAll(".cheat-group");
  var empty = sheet.querySelector(".cheat-empty");

  function apply() {
    var q = input.value.trim().toLowerCase();
    var category = filter.value;
    var shownTotal = 0;
    groups.forEach(function (group) {
      // Search the group title too, so "heroin" or "cannabis" finds that whole section
      var title = (group.querySelector(".cheat-group-title") || {}).textContent || "";
      var titleMatch = q && title.toLowerCase().indexOf(q) !== -1;
      var inCat = category === "all" || group.getAttribute("data-cat") === category;
      var shown = 0;
      group.querySelectorAll("li").forEach(function (item) {
        var match = inCat && (!q || titleMatch || item.textContent.toLowerCase().indexOf(q) !== -1);
        item.hidden = !match;
        if (match) shown++;
      });
      // Sub-lists (e.g. Possession / Delivery) hide when nothing in them matches
      group.querySelectorAll(".cheat-sub").forEach(function (sub) {
        sub.hidden = !sub.querySelector("li:not([hidden])");
      });
      group.hidden = shown === 0;
      shownTotal += shown;
    });
    empty.hidden = shownTotal > 0;
  }

  input.addEventListener("input", apply);
  filter.addEventListener("change", apply);

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
      filter.value = "all";
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

/*-- PAGE FILTER (nav search box) --*/
// Filters this page's accordion sections (and table rows on the chart page) as you type.
// Runs last so it also sees tables that main.js builds, like the street value chart.
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
    // Street value sections with no matching rows hide too
    document.querySelectorAll("main .value-group").forEach(function (group) {
      group.hidden = !!q && !group.querySelector("tbody tr:not([hidden])");
    });
    empty.hidden = shown > 0;
    empty.textContent = shown ? "" : 'Nothing on this page matches "' + input.value.trim() + '".';
  });
})();

/*-- SWIPE DOWN TO CLOSE (phones) --*/
// On small screens modals open as bottom sheets; dragging the header down closes them.
(function () {
  var phone = window.matchMedia("(max-width: 575.98px)");
  var start = null;
  var dialog = null;
  var dy = 0;

  document.addEventListener("touchstart", function (e) {
    var header = e.target.closest && e.target.closest(".modal.show .modal-header");
    if (!phone.matches || !header || e.target.closest(".btn-close")) return;
    dialog = header.closest(".modal-dialog");
    start = e.touches[0].clientY;
    dy = 0;
    dialog.style.transition = "none";
  }, { passive: true });

  document.addEventListener("touchmove", function (e) {
    if (start === null) return;
    dy = Math.max(0, e.touches[0].clientY - start);
    dialog.style.transform = "translateY(" + dy + "px)";
  }, { passive: true });

  function release() {
    if (start === null) return;
    var d = dialog;
    start = null;
    d.style.transition = "";
    d.style.transform = "";
    if (dy > 90) bootstrap.Modal.getOrCreateInstance(d.closest(".modal")).hide();
  }
  document.addEventListener("touchend", release);
  document.addEventListener("touchcancel", release);
})();

/*-- DIRECTIONS: APPLE MAPS ON IPHONE / IPAD --*/
// Directions buttons link to Google Maps. On iPhone and iPad, point them at Apple Maps
// instead, which opens the built-in Maps app with driving directions to the address.
(function () {
  var ua = navigator.userAgent || "";
  var isAppleMobile = /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS reports itself as a Mac
  if (!isAppleMobile) return;
  document.querySelectorAll('a[href^="https://www.google.com/maps/search/"]').forEach(function (link) {
    var address;
    try {
      address = new URL(link.href).searchParams.get("query");
    } catch (e) {
      return;
    }
    if (!address) return;
    link.href = "https://maps.apple.com/?daddr=" + encodeURIComponent(address) + "&dirflg=d";
    link.removeAttribute("target"); // same tab, so iOS hands straight off to the Maps app
    link.setAttribute("data-maps", "apple");
  });
})();
