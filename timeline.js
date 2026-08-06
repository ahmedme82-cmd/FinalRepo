/* ============ خط اليوم الزمني (24 ساعة) ============ */

const DAY_SECONDS = 86400;
const SEC_TO_PERCENT = 100 / DAY_SECONDS;

let tlDot = null;
let tlMarks = [];
let currentNext = null;

function buildTimeline(rec, wins) {

    const frag = document.createDocumentFragment();
    tlMarks = [];

    // Prayer windows
    for (const w of wins) {

        const seg = document.createElement("div");
        seg.className = "tl-seg";

        seg.style.left = `${w.a * SEC_TO_PERCENT}%`;
        seg.style.width = `${(w.b - w.a) * SEC_TO_PERCENT}%`;

        frag.appendChild(seg);
    }

    // Prayer markers
    EVENTS.forEach((e, index) => {

        const sec = toSec(rec[e.k]);

        const mk = document.createElement("div");
        mk.className = "tl-mark";
        mk.dataset.k = e.k;
        mk.dataset.sec = sec;

        mk.style.left = `${sec * SEC_TO_PERCENT}%`;

        // Alternate labels above/below to reduce collisions
        if (index % 2)
            mk.classList.add("alt");

        mk.title = e.n;

        const tick = document.createElement("i");
        tick.setAttribute("aria-hidden", "true");

        const lbl = document.createElement("b");
        lbl.textContent = hm12(rec[e.k]);

        const name = document.createElement("small");
        name.textContent = e.n;

        mk.append(tick, lbl, name);

        tlMarks.push(mk);
        frag.appendChild(mk);
    });

    // Current time marker
    tlDot = document.createElement("div");
    tlDot.className = "tl-dot";

    frag.appendChild(tlDot);

    DOM.tl.replaceChildren(frag);

    currentNext = null;
}

function updateTimeline(sec, nextKey) {

    if (tlDot) {
        tlDot.style.transform = `translateX(${sec * SEC_TO_PERCENT}%)`;
    }

    if (currentNext !== nextKey) {

        currentNext = nextKey;

        tlMarks.forEach(mark => {

            const prayerSec = Number(mark.dataset.sec);

            mark.classList.toggle("next", mark.dataset.k === nextKey);
            mark.classList.toggle("passed", prayerSec < sec);
        });
    }
}
