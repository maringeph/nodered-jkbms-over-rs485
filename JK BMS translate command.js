function numberToBytes(number, byteCount) {
    let bytes = [];
    for (let i = 0; i < byteCount; i++) {
        bytes.unshift(number & 0xFF); // Add the least significant byte of number to the start of the array
        number >>= 8; // Shift the number 8 bits to the right to prepare for the next iteration
    }
    return bytes;
}

function stringToBytes(str) {
    let byteArray = [];
    for (let i = 0; i < str.length; i++) {
        byteArray.push(str.charCodeAt(i));
    }
    return byteArray;
}



switch (msg.payload.command) {
    case 'activate':
        msg.payload.commandWord = 0x01;
        break;

    case 'write':
        msg.payload.commandWord = 0x02;
        break;

    case 'read':
        msg.payload.commandWord = 0x03;
        break;

    case 'pairCode':
        msg.payload.commandWord = 0x05;
        break;

    case 'readAll':
        msg.payload.commandWord = 0x06;
        break;
    
    default:
        msg.payload.commandWord = 0x00;
        break;
}


let dataIdentifier = [0x00];
let data_length = 0;
let data = [];

switch (msg.payload.dataIdentifier) {
    case 'cell_voltage':
        dataIdentifier = [0x79];
        break;

    case 'temperatur_internal':
        dataIdentifier = [0x80];
        break;

    case 'temperatur_battery1':
        dataIdentifier = [0x81];
        break;

    case 'temperatur_battery2':
        dataIdentifier = [0x82];
        break;

    case 'voltage':
        dataIdentifier = [0x83];
        break;

    case 'current':
        dataIdentifier = [0x84];
        break;

    case 'remainigBattery':
        dataIdentifier = [0x85];
        break;

    case 'numberOfNTC':
        dataIdentifier = [0x86];
        break;

    case 'numberOfBatteryCycles':
        dataIdentifier = [0x87];
        break;

    case 'batteryCycleCapacityAh':
        dataIdentifier = [0x89];
        break;

    case 'battery_strings':
        dataIdentifier = [0x8A];
        break;

    case 'warning':
        dataIdentifier = [0x8B];
        break;

    case 'status':
        dataIdentifier = [0x8C];
        break;

    case 'pack_OverVoltageProtection':
        dataIdentifier = [0x8E];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 100, data_length);
        }
        break;

    case 'pack_UnderVoltageProtection':
        dataIdentifier = [0x8F];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 100, data_length);
        }
        break;

    case 'cell_OverVoltageProtection':
        dataIdentifier = [0x90];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 1000, data_length);
        }
        break;

    case 'cell_OverVoltageProtectionRecovery':
        dataIdentifier = [0x91];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 1000, data_length);
        }
        break;

    case 'cell_OverVoltageProtectionDelay':
        dataIdentifier = [0x92];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value, data_length);
        }
        break;

    case 'cell_UnderVoltageProtection':
        dataIdentifier = [0x93];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 1000, data_length);
        }
        break;

    case 'cell_UnderVoltageProtectionRecovery':
        dataIdentifier = [0x94];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value * 1000, data_length);
        }
        break;

    case 'cell_UnderVoltageProtectionDelay':
        dataIdentifier = [0x95];
        if (msg.payload.command === 'write') {
            data_length = 2;
            data = numberToBytes(msg.payload.value, data_length);
        }
        break;
}

switch (msg.payload.command) {
    case 'write':
        msg.payload.dataWord = dataIdentifier.concat(data);
        break;

    case 'pairCode':
        msg.payload.dataWord = stringToBytes(msg.payload.value);
        break;

    default:
        msg.payload.dataWord = dataIdentifier;
        break;
}

return msg;
