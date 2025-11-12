let [seconds, minutes, hours] = [0, 0, 0];
let displayTime = document.getElementById("displayTime");
let timer = null;

function stopwatch() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
            minutes = 0;
            hours++;
        }
    }
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    displayTime.innerHTML = h + ":" + m + ":" + s;
}   
     function watchStart() {
        if (timer !== null) {
            clearInterval(timer);
        }
       timer = setInterval(stopwatch, 1000);
     }

     function watchStop() {
        clearInterval(timer);
     }
    // ---------- Unique enhancements inserted here ----------
    /* Quick feature list added:
        - Lap recording with animated list
        - Keyboard shortcuts: Space=start/stop, L=lap, R=reset
        - Theme toggle (animated gradient)
        - Voice announcements (toggle)
        - Save/export sessions to localStorage / CSV
        - Reset hook to clear extras
    */

    // Make sure watchReset is defined before this IIFE
    (function () {
         // State
         let laps = [];
         let voiceOn = false;
         let themeOn = false;

         // Create UI extras next to displayTime (if it exists)
         function buildExtrasUI() {
              if (!displayTime) return;

              // container
              const container = document.createElement("div");
              container.id = "stopwatchExtras";
              container.style.marginTop = "8px";
              container.style.display = "flex";
              container.style.gap = "8px";
              container.style.flexWrap = "wrap";
              displayTime.parentElement.appendChild(container);

              // helper to create button
              function btn(text, cb) {
                    const b = document.createElement("button");
                    b.textContent = text;
                    b.style.padding = "6px 10px";
                    b.style.borderRadius = "6px";
                    b.style.border = "none";
                    b.style.cursor = "pointer";
                    b.addEventListener("click", cb);
                    container.appendChild(b);
                    return b;
              }

              btn("Lap", watchLap);
              btn("Theme ✨", toggleTheme);
              btn("Voice 🔊", toggleVoice);
              btn("Save Session", saveSession);
              btn("Export CSV", exportCSV);

              // Lap list
              const lapBox = document.createElement("div");
              lapBox.id = "lapBox";
              lapBox.style.marginTop = "8px";
              lapBox.style.maxHeight = "160px";
              lapBox.style.overflow = "auto";
              lapBox.style.width = "100%";
              lapBox.style.fontFamily = "monospace";
              lapBox.style.fontSize = "13px";
              displayTime.parentElement.appendChild(lapBox);
         }

         // Record a lap with a small animated "echo"
         function watchLap() {
              const time = displayTime ? displayTime.innerText : formatTime();
              const t = { time, at: new Date().toISOString() };
              laps.push(t);

              const lapBox = document.getElementById("lapBox");
              if (!lapBox) return;

              const item = document.createElement("div");
              item.textContent = `${laps.length}. ${time}`;
              item.style.padding = "6px";
              item.style.borderRadius = "6px";
              item.style.marginBottom = "6px";
              item.style.display = "inline-block";
              item.style.background =
                    `linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`;
              item.style.backdropFilter = "blur(4px)";
              item.style.boxShadow = `0 4px 10px rgba(0,0,0,0.12)`;
              lapBox.prepend(item);

              // floating echo
              const echo = document.createElement("span");
              echo.textContent = time;
              echo.style.position = "fixed";
              const rect = displayTime.getBoundingClientRect();
              echo.style.left = `${rect.left + rect.width / 2 + (Math.random() * 80 - 40)}px`;
              echo.style.top = `${rect.top + (Math.random() * 20 - 10)}px`;
              echo.style.pointerEvents = "none";
              echo.style.opacity = "0.9";
              echo.style.fontSize = "14px";
              echo.style.transition = "transform 1200ms ease-out, opacity 1200ms ease-out";
              document.body.appendChild(echo);
              requestAnimationFrame(() => {
                    echo.style.transform = `translateY(-80px) rotate(${Math.random() * 30 - 15}deg)`;
                    echo.style.opacity = "0";
              });
              setTimeout(() => echo.remove(), 1400);

              // small pulse highlight on display
              pulseDisplay();
              if (voiceOn) speakText(`Lap ${laps.length}: ${time}`);
         }

         function pulseDisplay() {
              if (!displayTime) return;
              displayTime.animate(
                    [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
                    { duration: 420, easing: "ease-out" }
              );
         }

         // Voice
         function toggleVoice() {
              voiceOn = !voiceOn;
              alert(`Voice announcements ${voiceOn ? "enabled" : "disabled"}`);
         }
         function speakText(text) {
              if (!("speechSynthesis" in window)) return;
              const u = new SpeechSynthesisUtterance(text);
              u.rate = 1.05;
              window.speechSynthesis.cancel(); // avoid overlap
              window.speechSynthesis.speak(u);
         }

         // Theme (animated gradient) — inject once
         function toggleTheme() {
              themeOn = !themeOn;
              if (themeOn) {
                    document.documentElement.classList.add("stopwatch-rainbow");
                    injectThemeCSS();
              } else {
                    document.documentElement.classList.remove("stopwatch-rainbow");
              }
         }
         function injectThemeCSS() {
              if (document.getElementById("sw-theme-css")) return;
              const style = document.createElement("style");
              style.id = "sw-theme-css";
              style.textContent = `
              .stopwatch-rainbow {
                    transition: background 800ms linear;
                    background: linear-gradient(120deg, #0f172a, #0b1220);
                    animation: swGradient 14s linear infinite;
                    color: #e6eef8;
              }
              @keyframes swGradient {
                    0%{background:linear-gradient(120deg,#0f172a,#0b1220)}
                    25%{background:linear-gradient(120deg,#071a52,#082b1b)}
                    50%{background:linear-gradient(120deg,#3a0a0a,#0b1a3a)}
                    75%{background:linear-gradient(120deg,#0b3a13,#2b0b3a)}
                    100%{background:linear-gradient(120deg,#0f172a,#0b1220)}
              }
              #lapBox div:hover { transform: translateX(6px); transition: transform 160ms ease; }
              `;
              document.head.appendChild(style);
         }

         // Save session to localStorage
         function saveSession() {
              try {
                    const key = "sw_session_" + Date.now();
                    const payload = {
                         created: new Date().toISOString(),
                         time: displayTime ? displayTime.innerText : formatTime(),
                         laps
                    };
                    localStorage.setItem(key, JSON.stringify(payload));
                    alert("Session saved locally.");
              } catch (e) {
                    console.error(e);
                    alert("Save failed.");
              }
         }

         // Export as CSV
         function exportCSV() {
              if (!laps.length) {
                    alert("No laps to export.");
                    return;
              }
              const rows = [["index", "time", "recorded_at"]];
              laps.forEach((l, i) => rows.push([i + 1, l.time, l.at]));
              const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "stopwatch_laps.csv";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
         }

         // Format time fallback
         function formatTime() {
              const h = hours < 10 ? "0" + hours : hours;
              const m = minutes < 10 ? "0" + minutes : minutes;
              const s = seconds < 10 ? "0" + seconds : seconds;
              return `${h}:${m}:${s}`;
         }

         // Clear extras (used on reset)
         function clearExtras() {
              laps = [];
              const lapBox = document.getElementById("lapBox");
              if (lapBox) lapBox.innerHTML = "";
              // cancel any floating echoes
              document.querySelectorAll("body > span").forEach(s => {
                    if (s.textContent && s.textContent.match(/\d{2}:\d{2}:\d{2}/)) s.remove();
              });
         }

         // Keyboard shortcuts
         function keyHandler(e) {
              if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
              if (e.code === "Space") {
                    e.preventDefault();
                    if (timer === null) watchStart(); else watchStop();
              } else if (e.key.toLowerCase() === "l") {
                    watchLap();
              } else if (e.key.toLowerCase() === "r") {
                    watchReset();
              }
         }

         // Wrap watchReset after it is defined to clear extras on reset
         function installResetHook() {
              // Only run once and when watchReset exists
              if (typeof watchReset === "function") {
                    const original = watchReset;
                    watchReset = function () {
                         original();
                         clearExtras();
                    };
              } else {
                    // Try again shortly (script order safety)
                    setTimeout(installResetHook, 50);
              }
         }

         // init on DOM ready
         function init() {
              buildExtrasUI();
              document.addEventListener("keydown", keyHandler);
              installResetHook();
         }

         if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", init);
         } else {
              init();
         }

         // expose a tiny API for debugging from console
     }());

     // Define watchReset in the global scope
     function watchReset() {
         clearInterval(timer);
         [seconds, minutes, hours] = [0, 0, 0];
         displayTime.innerHTML = "00:00:00";
     }