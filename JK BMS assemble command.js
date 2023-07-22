
msg.timeout = 500;

function numberTo4HexBytes(number) {
    // Ensure the number is within the valid range for a 32-bit unsigned integer
    if (number < 0 || number > 0xFFFFFFFF) {
        throw new Error("Number out of range for 4-byte representation");
    }

    // Convert the number to a 4-byte array of hexadecimal values
    const hexBytes = [
        (number >> 24) & 0xFF,
        (number >> 16) & 0xFF,
        (number >> 8) & 0xFF,
        number & 0xFF,
    ];

    return hexBytes;
}

// Parameters
const bmsTerminalNumber = numberTo4HexBytes(msg.payload.bmsID);
const commandWord = msg.payload.commandWord;
const dataWord = msg.payload.dataWord;

const frameSource = 0x03; // BMS = 1, Bluetooth = 2, GPS = 3, PC = 4
const transportType = 0x00; // Request frame = 0, Response frame = 1, BMS active upload = 2
const recordNumber = [0x00, 0x00, 0x00, 0x00]; // Replace with the record number (4 bytes)

// Create the main part of the command array
const commandArray = [
    ...bmsTerminalNumber,
    commandWord, frameSource, transportType,
    ...dataWord,
    ...recordNumber,
    0x68
];

// Calculate the frame length (including the STX, LENGTH, and checksum)
const frameLength = commandArray.length + 6;

// Add STX and LENGTH (as two bytes) to the beginning of the command array
commandArray.unshift(0x57, (frameLength >> 8) & 0xFF, frameLength & 0xFF);
commandArray.unshift(0x4E);

// Calculate the checksum (low 2 bytes)
let checksum = 0;
for (let i = 0; i < commandArray.length; i++) {
    checksum += commandArray[i];
}
const checksumLow2Bytes = checksum & 0xFFFF;

// Add the checksum (high 2 bytes are not used) to the command array
commandArray.push(0x00, 0x00, (checksumLow2Bytes >> 8) & 0xFF, checksumLow2Bytes & 0xFF);

// Create a Buffer from the array and set it as the payload
msg.payload = Buffer.from(commandArray);

return msg;
