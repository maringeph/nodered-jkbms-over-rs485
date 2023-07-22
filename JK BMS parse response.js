function constructInt32(data_array, data_start, first_byte, last_byte) {
    if (data_array[data_start + last_byte] == undefined) {
        if (showWarnings) {
            node.warn('(' + data_start + ') Data too short');
        }
        return null;
    }
    let result = 0;
    for (let i = first_byte; i <= last_byte; i++) {
        result = (result << 8) | data_array[data_start + i];
    }
    return result;
}


let showWarnings = false;
let callback = { payload: 'retry' };
let data = { bmsID: constructInt32(msg.request_payload, 4, 0, 3) };
let debug = { bmsID: data.bmsID };
debug.payload = {};

// no response
if (msg.payload == undefined) {
    if (showWarnings) {
        node.warn('No response from device');
    }
    return [callback, null, null];
}



//////////////////////////////////////////////////
// Split msg.payload
//////////////////////////////////////////////////

// 1 STX
let data_start  = 0;
let data_length = 2;
debug.payload.header = msg.payload.slice(data_start, data_start + data_length);

// 2 LENGTH
data_start += data_length;
data_length = 2;
debug.payload.length = msg.payload.slice(data_start, data_start + data_length);
debug.payload.frame_length = constructInt32(debug.payload.length, 0, 0, 1);

// 3 Terminal no.
data_start += data_length;
data_length = 4;
debug.payload.terminal_number = msg.payload.slice(data_start, data_start + data_length);

// 4 Command word
data_start += data_length;
data_length = 1;
debug.payload.command_word = msg.payload.slice(data_start, data_start + data_length);

// 5 The frame source
data_start += data_length;
data_length = 1;
debug.payload.frame_source = msg.payload.slice(data_start, data_start + data_length);

// 6 Transport type
data_start += data_length;
data_length = 1;
debug.payload.transport_type = msg.payload.slice(data_start, data_start + data_length);

// 7 Identifier + data
data_start += data_length;
data_length = debug.payload.frame_length - 18; // 18 = 2+4+1+1+1 + 4+1+4
data.payload = msg.payload.slice(data_start, data_start + data_length);

// 8 Record number
data_start += data_length;
data_length = 4;
debug.payload.record_number = msg.payload.slice(data_start, data_start + data_length);

// 9 End of identity
data_start += data_length;
data_length = 1;
debug.payload.footer = msg.payload.slice(data_start, data_start + data_length);

// 10 The checksum
data_start += data_length;
data_length = 4;
debug.payload.remote_crc = msg.payload.slice(data_start, data_start + data_length);



//////////////////////////////////////////////////
// Validate msg.payload
//////////////////////////////////////////////////

// Check header
if (debug.payload.header[0] != 0x4E || debug.payload.header[1] != 0x57) {
    if (showWarnings){
        if (debug.payload.header[0] == undefined) {
            node.warn('Invalid header: undefined');
        } else if (debug.payload.header[1] == undefined) {
            node.warn('Invalid header: 0x' + debug.payload.header[0].toString(16).toUpperCase());
        } else {
            node.warn('Invalid header: 0x' + debug.payload.header[0].toString(16).toUpperCase() + debug.payload.header[1].toString(16).toUpperCase());
        }
    }
    return [callback, null, debug];
}

// Check footer
if (debug.payload.footer[0] != 0x68) {
    if (showWarnings) {
        if (debug.payload.footer[0] == undefined) {
            node.warn('Invalid footer: undefined');
        } else {
            node.warn('Invalid footer: 0x' + debug.payload.footer[0].toString(16).toUpperCase());
        }
    }
    return [callback, null, debug];
}

// Calculate the checksum (low 2 bytes)
let checksum = 0;
for (let i = 2; i < msg.payload.length - 4; i++) {
    checksum += msg.payload[i];
}
checksum += (checksum ^ 0xFFFF) & 0x00FF;
checksum += 0x0101;

const checksumLow2Bytes = checksum & 0xFFFF;

// Check the checksum
debug.payload.calculated_crc = [0x00, 0x00, (checksumLow2Bytes >> 8) & 0xFF, checksumLow2Bytes & 0xFF];
if (debug.payload.calculated_crc !== debug.payload.remote_crc) {
    if (showWarnings) {
        node.warn('JkModbus CRC Check failed!');
    }
    /* doesn't work - TODO
    return [callback, null, debug]; */
}

return [null, data, debug];
