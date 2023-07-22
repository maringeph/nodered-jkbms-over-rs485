function constructInt32(data_array, data_start, first_byte, last_byte) {
    if (data_array[data_start + last_byte] == undefined) {
        if (showWarnings) {
            node.warn('(' + data_start + ') 0x' + data_array[data_start].toString(16).toUpperCase() + ' Data too short');
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
let data = {};
data.payload = { bmsID: msg.bmsID };
let data_start = 0;
let data_length;



//////////////////////////////////////////////////
// don't parse ACK response
//////////////////////////////////////////////////
if (msg.payload.length === 1) {
    callback.payload = 'ack';
    return [callback, null, null];
}



//////////////////////////////////////////////////
// parse data response
//////////////////////////////////////////////////
do {
    switch (msg.payload[data_start]) {
        case 0x79:  // cell voltages
            data_length = 1 + constructInt32(msg.payload, data_start, 1, 1);

            // Get number of cells or check data length
            if (data.payload.cells == undefined){
                data.payload.cells = constructInt32(msg.payload, data_start, 1, 1) / 3;
            } else {
                if (data.payload.cells != constructInt32(msg.payload, data_start, 1, 1) / 3) {
                    if (showWarnings) {
                        if (msg.payload[data_start + 1] == undefined) {
                            node.warn('(' + data_start + ') 0x79 Data length invalid: undefined');
                        } else {
                            node.warn('(' + data_start + ') 0x79 Data length invalid: 0x' + constructInt32(msg.payload, data_start, 1, 1).toString(16).toUpperCase());
                        }
                    }
                    return [callback, null, data];
                }
            }

            // Get Values of all cells
            data.payload.cell_voltage = [];
            for (let cell = 0; cell < data.payload.cells; cell++) {
                let cellpointer = 2 + cell * 3;

                if (constructInt32(msg.payload, data_start + cellpointer, 0, 0) != cell + 1) {
                    if (showWarnings) {
                        if (constructInt32(msg.payload, data_start + cellpointer, 0, 0) == undefined) {
                            node.warn('(' + data_start + ') 0x79 Cell number ' + cell + ' invalid: undefined');
                        } else {
                            node.warn('(' + data_start + ') 0x79 Cell number ' + cell + ' invalid: 0x' + constructInt32(msg.payload, data_start + cellpointer, 0, 0).toString(16).toUpperCase());
                        }
                    }
                    return [callback, null, data];
                }
                data.payload.cell_voltage[cell] = constructInt32(msg.payload, data_start + cellpointer, 1, 2) / 1000;
            }
            break;

        case 0x80:  // temperature mosfet
            data_length = 2;
            data.payload.temperature = data.payload.temperature || {};
            data.payload.temperature.internal = constructInt32(msg.payload, data_start, 1, data_length);
            if (data.payload.temperature.internal > 100) {
                data.payload.temperature.internal = (data.payload.temperature.internal - 100) * -1;
            }
            if (data.payload.temperature.internal < -40) {
                if (showWarnings) {
                    node.warn('(' + data_start + ') 0x80 Temperature Mosfet out of range: ' + data.payload.temperature.internal);
                }
                return [callback, null, data];
            }
            break;

        case 0x81:  // temperature battery 1
            data_length = 2;
            data.payload.temperature = data.payload.temperature || {};
            data.payload.temperature.battery1 = constructInt32(msg.payload, data_start, 1, data_length);
            if (data.payload.temperature.battery1 > 100) {
                data.payload.temperature.battery1 = (data.payload.temperature.battery1 - 100) * -1;
            }
            if (data.payload.temperature.battery1 < -40) {
                if (showWarnings) {
                    node.warn('(' + data_start + ') 0x81 Temperature Battery 1 out of range: ' + data.payload.temperature.battery1);
                }
                return [callback, null, data];
            }
            break;

        case 0x82:  // temperature battery 2
            data_length = 2;
            data.payload.temperature = data.payload.temperature || {};
            data.payload.temperature.battery2 = constructInt32(msg.payload, data_start, 1, data_length);
            if (data.payload.temperature.battery2 > 100) {
                data.payload.temperature.battery2 = (data.payload.temperature.battery2 - 100) * -1;
            }
            if (data.payload.temperature.battery2 < -40) {
                if (showWarnings) {
                    node.warn('(' + data_start + ') 0x82 Temperature Battery 2 out of range: ' + data.payload.temperature.battery2);
                }
                return [callback, null, data];
            }
            break;

        case 0x83:  // voltage
            data_length = 2;
            data.payload.voltage = constructInt32(msg.payload, data_start, 1, data_length) / 100;
            break;

        case 0x84:  // current
            data_length = 2;
            data.payload.current = constructInt32(msg.payload, data_start, 1, data_length);

            let CURRENT_ZERO_CONSTANT = 32768
            if (data.payload.current < CURRENT_ZERO_CONSTANT) {
                data.payload.current = data.payload.current / -100;
            } else {
                data.payload.current = (data.payload.current - CURRENT_ZERO_CONSTANT) / 100;
            }
            /*
            if (true /*Agreement version number >= 0x01* /) {
                if ((data.payload.current & 0x8000) == 0x8000) {
                    data.payload.current = data.payload.current & 0x7FFF;
                } else {
                    data.payload.current = data.payload.current & 0x7FFF * -1;
                }
            } else {
                if (data.payload.current > 10000) {
                    data.payload.current -= 10000;
                    data.payload.current *= -1;
                }
            }

            data.payload.current /= 100;*/
            break;

        case 0x85:  // remainig battery
            data_length = 1;
            data.payload.remainigBattery = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x86:  // Number of battery temperature sensors
            data_length = 1;
            data.payload.numberOfNTC = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x87:  // Cycle times of battery use
            data_length = 2;
            data.payload.numberOfBatteryCycles = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x89:  // Total capacity of battery cycle
            data_length = 4;
            data.payload.batteryCycleCapacityAh = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x8A:  // Total number of battery strings
            data_length = 2;
            
            // Get number of cells or check data length
            if (data.payload.cells == undefined) {
                data.payload.cells = constructInt32(msg.payload, data_start, 1, data_length);
            } else {
                if (data.payload.cells != constructInt32(msg.payload, data_start, 1, data_length)) {
                    if (showWarnings) {
                        if (constructInt32(msg.payload, data_start, 1, 2) == undefined) {
                            node.warn('(' + data_start + ') 0x8A Data length invalid: undefined');
                        } else {
                            node.warn('(' + data_start + ') 0x8A Data length invalid: 0x' + constructInt32(msg.payload, data_start, 1, data_length).toString(16).toUpperCase());
                        }
                    }
                    return [callback, null, data];
                }
            }
            break;

        case 0x8B:  // Battery Warning Message
            data_length = 2;
            const batteryWarning = constructInt32(msg.payload, data_start, 1, data_length);

            data.payload.warning = {};
            data.payload.warning.lowCapacity                = (batteryWarning & 0b0000000000000001) > 0;
            data.payload.warning.mosfetOverTemperature      = (batteryWarning & 0b0000000000000010) > 0;
            data.payload.warning.chargingOverVoltage        = (batteryWarning & 0b0000000000000100) > 0;
            data.payload.warning.dischargingUnderVoltage    = (batteryWarning & 0b0000000000001000) > 0;
            data.payload.warning.batteryOverTemperature1    = (batteryWarning & 0b0000000000010000) > 0;
            data.payload.warning.chargingOverCurrent        = (batteryWarning & 0b0000000000100000) > 0;
            data.payload.warning.dischargingOverCurrent     = (batteryWarning & 0b0000000001000000) > 0;
            data.payload.warning.cellVoltageDifference      = (batteryWarning & 0b0000000010000000) > 0;
            data.payload.warning.batteryOverTemperature2    = (batteryWarning & 0b0000000100000000) > 0;
            data.payload.warning.batteryUnderTemperature    = (batteryWarning & 0b0000001000000000) > 0;
            data.payload.warning.cellOverVoltage            = (batteryWarning & 0b0000010000000000) > 0;
            data.payload.warning.cellUnderVoltage           = (batteryWarning & 0b0000100000000000) > 0;
            data.payload.warning.alarm309_AProtection       = (batteryWarning & 0b0001000000000000) > 0;
            data.payload.warning.alarm309_BProtection       = (batteryWarning & 0b0010000000000000) > 0;
            break;

        case 0x8C:  // Battery status information
            data_length = 2;
            const batteryStatus = constructInt32(msg.payload, data_start, 1, data_length);

            data.payload.status = {};
            data.payload.status.chargingActive              = (batteryStatus & 0b0000000000000001) > 0;
            data.payload.status.dischargingActive           = (batteryStatus & 0b0000000000000010) > 0;
            data.payload.status.balancingActive             = (batteryStatus & 0b0000000000000100) > 0;
            data.payload.status.batteryDisconnected         = (batteryStatus & 0b0000000000001000) > 0;
            break;

        case 0x8E:  // Total voltage overvoltage protection
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_OverVoltageProtection = constructInt32(msg.payload, data_start, 1, data_length) / 100;
            break;

        case 0x8F:  // Total voltage under voltage protection
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_UnderVoltageProtection = constructInt32(msg.payload, data_start, 1, data_length) / 100;
            break;

        case 0x90:  // Monomer overvoltage protection voltage
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_OverVoltageProtection = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x91:  // Overvoltage recovery voltage of monomer
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_OverVoltageProtectionRecovery = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x92:  // Monomer overvoltage protection delay
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_OverVoltageProtectionDelay = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x93:  // Unit undervoltage protection voltage
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_UnderVoltageProtection = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x94:  // Monomer undervoltage recovery voltage
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_UnderVoltageProtectionRecovery = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x95:  // Monomer undervoltage protection delay
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.cell_UnderVoltageProtectionDelay = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x96:  // Core differential pressure protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            //data.payload.settings.cell_BalanceTriggerVoltage = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x97:  // Discharge overcurrent protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_DischargeOverCurrentProtection = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x98:  // Overcurrent delay of discharge
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_DischargeOverCurrentProtectionDelay = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x99:  // Charge overcurrent protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_ChargeOverCurrentProtection = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x9A:  // Charge overcurrent delay
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.pack_ChargeOverCurrentProtectionDelay = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x9B:  // Equalizing starting voltage
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            //data.payload.settings.cell_BalanceStartingVoltage = constructInt32(msg.payload, data_start, 1, data_length) / 1000;
            break;

        case 0x9C:  // Equalize the opening differential pressure
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            // TODO
            break;

        case 0x9D:  // Active equalizing switch
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.balancingEnabled = (msg.payload[data_start + 1] & 0b00000001) > 0;
            break;

        case 0x9E:  // Power tube temperature protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.bms_overTemperatureProtection = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0x9F:  // Power tube temperature recovery value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.bms_overTemperatureProtectionRecovery = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA0:  // Temperature protection value in the battery box
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_overTemperatureProtection = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA1:  // Temperature recovery value in the battery box
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_overTemperatureProtectionRecovery = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA2:  // Temperature difference protection value of battery
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_temperatureDifferenceProtection = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA3:  // Battery charging high temperature protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_overTemperatureProtectionCharge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA4:  // Battery discharge high temperature protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_overTemperatureProtectionDischarge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA5:  // Charge low temperature protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_underTemperatureProtectionCharge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA6:  // Charge low temperature protection recovery value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_underTemperatureProtectionRecoveryCharge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA7:  // Discharge low temperature protection value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_underTemperatureProtectionDischarge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA8:  // Discharge cryogenic protection recovery value
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.battery_underTemperatureProtectionRecoveryDischarge = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xA9:  // Battery string count Settings
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            // TODO
            break;

        case 0xAA:  // Battery capacity setting
            data_length = 4;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.batteryCapacity = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xAB:  // Charge MOS tube switch
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.chargingEnabled = (msg.payload[data_start + 1] & 0b00000001) > 0;
            break;

        case 0xAC:  // Discharge MOS tube switch
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.dischargingEnabled = (msg.payload[data_start + 1] & 0b00000001) > 0;
            break;

        case 0xAD:  // Current calibration
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.calibrationCurrent = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xAE:  // Guard plate address
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            // TODO
            break;

        case 0xAF:  // The battery type
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.batteryType = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xB0:  // Dormancy waiting time
            data_length = 2;
            data.payload.settings = data.payload.settings || {};
            // TODO
            break;

        case 0xB1:  // Low capacity alarm value
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.lowCapacityAlarm = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xB2:  // Change parameter password
            data_length = 10;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.parameterPassword = msg.payload.slice(data_start + 1, data_start + data_length + 1).toString('ascii');
            break;

        case 0xB3:  // Special charger switch
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            // TODO
            break;

        case 0xB4:  // The device ID code
            data_length = 8;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.userPrivateData = msg.payload.slice(data_start + 1, data_start + data_length + 1).toString('ascii');
            break;

        case 0xB5:  // Manufacture date
            data_length = 4;
            data.payload.settings = data.payload.settings || {};
            data.payload.manufactureDate = msg.payload.slice(data_start + 1, data_start + data_length + 1).toString('ascii');
            break;

        case 0xB6:  // System working time
            data_length = 4;
            data.payload.settings = data.payload.settings || {};
            data.payload.systemWorkingTime = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xB7:  // Software version number
            data_length = 15;
            data.payload.settings = data.payload.settings || {};
            data.payload.softwareVersion = msg.payload.slice(data_start + 1, data_start + data_length + 1).toString('ascii');
            break;

        case 0xB8:  // Whether to start current calibration
            data_length = 1;
            data.payload.settings = data.payload.settings || {};
            data.payload.settings.calibrationCurrentStart = (msg.payload[data_start + 1] & 0b00000001) > 0;
            break;

        case 0xB9:  // Actual battery capacity
            data_length = 4;
            data.payload.settings = data.payload.settings || {};
            data.payload.actualBatteryCapacity = constructInt32(msg.payload, data_start, 1, data_length);
            break;

        case 0xBA:  // Name of Manufacturer ID
            data_length = 24;
            data.payload.settings = data.payload.settings || {};
            data.payload.manufacturerID = msg.payload.slice(data_start + 1, data_start + data_length + 1).toString('ascii');
            break;
/*
        case 0xBB:  // Restart the system
            data_length = 1;
            // TODO
            break;

        case 0xBC:  // factory data reset
            data_length = 1;
            // TODO
            break;

        case 0xBD:  // Remote Upgrade Identification
            data_length = 1;
            // TODO
            break;

        case 0xBE:  // The cell turns off GPS with low voltage
            data_length = 2;
            // TODO
            break;

        case 0xBF:  // Cell low voltage recovery GPS
            data_length = 2;
            // TODO
            break;
*/
        case 0xC0:  // Agreement version number
            data_length = 1;
            // TODO
            break;
        
        default:
            if (showWarnings) {
                if (constructInt32(msg.payload, data_start, 0, 0) == undefined) {
                    node.warn('(' + data_start + ') Data identification code invalid: undefined');
                } else {
                    node.warn('(' + data_start + ') Data identification code invalid: 0x' + constructInt32(msg.payload, data_start, 0, 0).toString(16).toUpperCase());
                }
            }
            return [callback, null, data];
    }
    data_start += 1 + data_length;
} while (data_start < msg.payload.length);

if ('current' in data.payload) {
    // state
    if (data.payload.current > 0) {
        data.payload.state = 'charging';
    } else if (data.payload.current < 0) {
        data.payload.state = 'discharging';
    } else {
        data.payload.state = 'idle';
    }

    // calculate the power
    if ('voltage' in data.payload) {
        data.payload.power = Math.round(data.payload.voltage * data.payload.current * 10) / 10;
    }
}

data.payload.dataSource = 'RS485';

callback.payload = 'next';
return [callback, data, null];
