document.addEventListener("DOMContentLoaded", function () {
    const devices = [
        { name: 'RPi 4', color: '#8B0000' },
        { name: 'RPi 5', color: '#00008B' },
        // { name: 'RPi 3', color: '#4B0082' },
        // { name: 'RPi 4', color: '#006400' }
    ];

    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'unpacked_box', 'empty_box', 'total'];

    const navbar = document.getElementById('navbar');

    devices.forEach((device, index) => {
        const deviceLink = document.createElement('a');
        deviceLink.textContent = device.name;
        deviceLink.style.backgroundColor = device.color; // Optional: Use device color for background
        navbar.appendChild(deviceLink);

        generateTableForDevice(device, index + 1);
    });

    function generateTableForDevice(device, deviceId) {
        const table = document.querySelector(`#device${deviceId} table`);
        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        const keyHeader = headerRow.insertCell(0);
        const valueHeader = headerRow.insertCell(1);
        keyHeader.textContent = "Detection";
        valueHeader.textContent = "Count";

        // Apply device color to headers
        headerRow.style.backgroundColor = device.color;
        headerRow.style.color = "white";

        keys.forEach(key => {
            const row = table.insertRow();
            const keyCell = row.insertCell(0);
            const valueCell = row.insertCell(1);
            keyCell.textContent = key.replace(/_/g,' ').toUpperCase();
            valueCell.textContent = 0; // Random integer
            valueCell.id = `${device.name.replace(/ /g,'').toLowerCase()}-${key}`;
        });
    }

    function updateTableValue(device, key, newValue) {
        const cellId = `${device}-${key}`;
        const cell = document.getElementById(cellId);
    
        if (cell) {
            cell.textContent = newValue;
        } else {
            console.log(`Cell with key '${key}' not found.`);
        }
    }

    function updateTotal(device) {

        let totalSum = 0;
    
        keys.filter((e,i)=>e!=='total').forEach(key => {
            const cellValue = document.getElementById(`${device}-${key}`).textContent;
            totalSum += parseInt(cellValue, 10);
        });
    
        const totalCell = document.getElementById(`${device}-total`);
        if (totalCell) {
            totalCell.textContent = totalSum;
        } 
    }

    // ======== Socket.io =========

    const socket = io("http://35.223.249.6:8000/", { transports : ['websocket'] });

    socket.on("connect", () => {
        console.log(socket.connected); // true
    });

    socket.on("disconnect", () => {
        console.log(socket.connected); // false
    });

    socket.on("detection_counts", (data) => {
        console.log("counts", data); // false
        for(let key of Object.keys(data)){
            updateTableValue('rpi4', key, data[key])
        }
        updateTotal('rpi4');
    });
});

