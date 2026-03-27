// function openModal() {
//   document.getElementById("modal").classList.remove("hidden");
//   document.body.style.overflow = "hidden";
//   const last = fuelData[fuelData.length - 1];
//   document.getElementById("f-from").value = last.to;
//   document.getElementById("f-date").value = new Date().toISOString().split("T")[0];
// }

// function closeModal() {
//   document.getElementById("modal").classList.add("hidden");
//   document.body.style.overflow = "";
//   resetForm();
// }

// function resetForm() {
//   ["f-date", "f-from", "f-to", "f-rupees", "f-litre", "f-notes"].forEach(
//     (id) => (document.getElementById(id).value = "")
//   );
//   document.getElementById("diff-preview").classList.add("hidden");
//   document.getElementById("calc-preview").classList.add("hidden");
// }

// // Event delegation on modal — works regardless of when inputs mount
// document.getElementById("modal").addEventListener("input", (e) => {
//   if (["f-from", "f-to", "f-rupees", "f-litre"].includes(e.target.id)) {
//     updatePreview();
//   }
// });

// function updatePreview() {
//   const from   = parseFloat(document.getElementById("f-from").value);
//   const to     = parseFloat(document.getElementById("f-to").value);
//   const rupees = parseFloat(document.getElementById("f-rupees").value);
//   const litre  = parseFloat(document.getElementById("f-litre").value);

//   const diffPreview = document.getElementById("diff-preview");
//   if (!isNaN(from) && !isNaN(to) && to > from) {
//     diffPreview.classList.remove("hidden");
//     document.getElementById("diff-val").textContent = to - from + " km";
//   } else {
//     diffPreview.classList.add("hidden");
//   }

//   const calcPreview = document.getElementById("calc-preview");
//   if (!isNaN(from) && !isNaN(to) && to > from && rupees > 0 && litre > 0) {
//     const diff = to - from;
//     calcPreview.classList.remove("hidden");
//     document.getElementById("calc-mileage").textContent = (diff / litre).toFixed(2);
//     document.getElementById("calc-cpk").textContent     = "₹" + (rupees / diff).toFixed(2);
//     document.getElementById("calc-ppl").textContent     = "₹" + (rupees / litre).toFixed(2);
//   } else {
//     calcPreview.classList.add("hidden");
//   }
// }

// function submitForm() {
//   const date   = document.getElementById("f-date").value;
//   const from   = parseFloat(document.getElementById("f-from").value);
//   const to     = parseFloat(document.getElementById("f-to").value);
//   const rupees = parseFloat(document.getElementById("f-rupees").value);
//   const litre  = parseFloat(document.getElementById("f-litre").value);
//   const notes  = document.getElementById("f-notes").value;

//   if (!date)                     return showToast("❌", "Please enter a date");
//   if (isNaN(from) || to <= from) return showToast("❌", "Invalid odometer readings");
//   if (!rupees || rupees <= 0)    return showToast("❌", "Please enter amount paid");
//   if (!litre  || litre  <= 0)    return showToast("❌", "Please enter litres filled");

//   const diff = to - from;
//   const avg  = parseFloat((diff / litre).toFixed(2));
//   const newEntry = { from, to, diff, avg, rupees, litre, date, notes };

//   // 🔌 CONNECT YOUR BACKEND HERE ──────────────────────────────
//   // fetch("/api/fuel", {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify(newEntry),
//   // }).then(res => res.json()).then(saved => { ... });
//   // ────────────────────────────────────────────────────────────

//   closeModal();
//   showToast("✅", `Entry saved — ${diff} km @ ${avg} km/L`);
// }

// // Close modal on overlay click
// document.getElementById("modal").addEventListener("click", function (e) {
//   if (e.target === this) closeModal();
// });
// export { openModal, closeModal, updatePreview, submitForm };
