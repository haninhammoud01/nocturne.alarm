// Blok kode ini mempersiapkan objek untuk suara alarm.
bel = new Audio('alarm-ringtone.mp3');
bel.loop = true;

// --- Unlock audio tanpa memainkan suara ---
let audioUnlocked = false;

function unlockAudio() {
    if (!audioUnlocked) {
        bel.play()
            .then(() => {
                bel.pause();
                bel.currentTime = 0;
                audioUnlocked = true;
                console.log("Audio context unlocked for alarm.");
            })
            .catch(e => console.log("Failed to unlock audio:", e));
    }
}

// Aktifkan unlock saat ada interaksi (klik/touch)
document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio, { once: true });

let alarmListArr = [];
const selectMenu = $('select');
const setAlarmBtn = $('#btn-setAlarm');
let alarmCount = 0;
let alarmTime;

// Analog Clock
function updateClock() {
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = "AM";

    // Blok kode ini memastikan format jam yang ditampilkan sesuai dengan format 12 jam.
    if (hour == 0) {
        hour = 12;
    }

    if (hour > 12) {
        hour -= 12;
        pe = "PM";
    }

    // Fungsi pad ini membantu memformat angka menjadi string dengan jumlah digit tertentu.
    Number.prototype.pad = function (digits) {
        for (var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }

    // Blok kode ini menyiapkan data yang nantinya akan digunakan untuk menampilkan tanggal dan waktu pada jam digital.
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Perbaikan typo
    var ids = ["dayName", "month", "dayNum", "year", "hour", "minutes", "seconds", "period"];
    var values = [week[dname], months[mo], dnum.pad(2), yr, hour.pad(2), min.pad(2), sec.pad(2), pe];

    // Blok kode ini secara keseluruhan bertugas untuk memperbarui tampilan tanggal dan waktu pada jam digital.  
    for (var i = 0; i < ids.length; i++) {
        $('#' + ids[i]).text(values[i]);
    }

    // Cek apakah waktunya alarm
    for (let i = 0; i < alarmListArr.length; i++) {
        if (alarmListArr[i] == `${hour.pad(2)}:${min.pad(2)}:${sec.pad(2)} ${pe}`) {
            if (audioUnlocked) {
                bel.play().catch(e => console.log("Alarm play failed:", e));
            } else {
                // Jika belum unlock, coba unlock dulu
                unlockAudio();
                setTimeout(() => {
                    if (audioUnlocked) bel.play().catch(e => console.log("Alarm retry failed:", e));
                }, 100);
            }
            $('#stopAlarm').css('visibility', 'visible');
        }
    }
}

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

// Set Alarm section
for (let i = 12; i > 0; i--) {
    i = i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu.eq(0).find('option:first-child').after(option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu.eq(1).find('option:first-child').after(option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu.eq(2).find('option:first-child').after(option);
}

for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu.eq(3).find('option:first-child').after(option);
}

// add alarm
function setAlarm() {
    $('#alarm-h3').text('Alarms');
    let time = `${selectMenu.eq(0).val()}:${selectMenu.eq(1).val()}:${selectMenu.eq(2).val()} ${selectMenu.eq(3).val()}`;
    if (time.includes("setHour") || time.includes("setMinute") || time.includes("setSeconds") || time.includes("AM/PM")) {
        alert("Please, Select Valid Input");
    } else {
        alarmCount++;
        $('.alarmList').append(`
        <div class="alarmLog" id="alarm${alarmCount}">
            <span id="span${alarmCount}">${time}</span>
            <button class="btn-delete" id="${alarmCount}" onClick="deleteAlarm(this.id)">Delete</button>
        </div>`);

        alarmTime = `${selectMenu.eq(0).val()}:${selectMenu.eq(1).val()}:${selectMenu.eq(2).val()} ${selectMenu.eq(3).val()}`;
        alarmListArr.push(alarmTime);
        alert(`Your Alarm Set ${alarmTime}.`);
    }
}

setAlarmBtn.on('click', setAlarm);

// delete alarm
function deleteAlarm(click_id) {
    var element = $('#alarm' + click_id);
    var deleteIndex = alarmListArr.indexOf($('#span' + click_id).text());
    alarmListArr.splice(deleteIndex, 1);
    element.remove();
    alert(`Your Alarm ${click_id} Deleted.`);
}

// Fungsi stop alarm
function stopAlarm() {
    bel.pause();
    bel.currentTime = 0;
    $('#stopAlarm').css('visibility', 'hidden');
}

// Event listener untuk tombol stop alarm
$('#stopAlarm').on('click', stopAlarm);

// Jalankan jam
initClock();