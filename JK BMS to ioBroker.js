let ioBrokerPath;
if ('payload' in msg) {
    for (let ii = 0; ii < 2; ii++) {
        switch (ii) {
            case 0:
                ioBrokerPath = 'node-red.0.devices.JK-BMS.' + (msg.payload.bmsID - 100) + '.';
                break;
            case 1:
                ioBrokerPath = ioBrokerPath + msg.payload.dataSource + '.';
                break;
        }

        // voltage
        if ('voltage' in msg.payload) {
            node.send({
                payload: msg.payload.voltage,
                topic: ioBrokerPath + 'voltage',
                stateName: {
                    "en": "Voltage",
                    "de": "Spannung"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'V',
                stateReadonly: true,
                ack: true,
            });
        }

        // current
        if ('current' in msg.payload) {
            node.send({
                payload: msg.payload.current,
                topic: ioBrokerPath + 'current',
                stateName: {
                    "en": "Current",
                    "de": "Stromstärke"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'A',
                stateReadonly: true,
                ack: true,
            });
        }

        // power
        if ('power' in msg.payload) {
            node.send({
                payload: msg.payload.power,
                topic: ioBrokerPath + 'power',
                stateName: {
                    "en": "Power",
                    "de": "Leistung"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'W',
                stateReadonly: true,
                ack: true,
            });
        }

        // real_voltage
        if ('real_voltage' in msg.payload) {
            node.send({
                payload: msg.payload.real_voltage,
                topic: ioBrokerPath + 'real_voltage',
                stateName: {
                    "en": "Voltage (calibrated)",
                    "de": "Spannung (kalibriert)"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'V',
                stateReadonly: true,
                ack: true,
            });
        }

        // real_current
        if ('real_current' in msg.payload) {
            node.send({
                payload: msg.payload.real_current,
                topic: ioBrokerPath + 'real_current',
                stateName: {
                    "en": "Current (calibrated)",
                    "de": "Stromstärke (kalibriert)"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'A',
                stateReadonly: true,
                ack: true,
            });
        }

        // real_power
        if ('real_power' in msg.payload) {
            node.send({
                payload: msg.payload.real_power,
                topic: ioBrokerPath + 'real_power',
                stateName: {
                    "en": "Power (calibrated)",
                    "de": "Leistung (kalibriert)"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: 'W',
                stateReadonly: true,
                ack: true,
            });
        }

        // state
        if ('state' in msg.payload) {
            node.send({
                payload: msg.payload.state,
                topic: ioBrokerPath + 'status',
                stateName: {
                    "en": "State",
                    "de": "Status"
                },
                stateRole: 'state',
                stateType: 'string',
                stateReadonly: true,
                ack: true,
            });
        }

        // remainigBattery
        if ('remainigBattery' in msg.payload) {
            node.send({
                payload: msg.payload.remainigBattery,
                topic: ioBrokerPath + 'remainigBattery',
                stateName: {
                    "en": "Battery level",
                    "de": "Akkustand"
                },
                stateRole: 'state',
                stateType: 'number',
                stateUnit: '%',
                stateMin: 0,
                stateMax: 100,
                stateReadonly: true,
                ack: true,
            });
        }



        //////////////////////////////////////////////////
        // temperature
        //////////////////////////////////////////////////
        if ('temperature' in msg.payload) {
            
            // temperature internal
            if ('internal' in msg.payload.temperature) {
                node.send({
                    payload: msg.payload.temperature.internal,
                    topic: ioBrokerPath + 'temperature.internal',
                    stateName: {
                        "en": "Temperature Mosfet",
                        "de": "Temperatur Mosfet"
                    },
                    stateRole: 'state',
                    stateType: 'number',
                    stateUnit: '°C',
                    stateMin: -40,
                    stateMax: 100,
                    stateReadonly: true,
                    ack: true,
                });
            }

            // temperature battery1
            if ('battery1' in msg.payload.temperature) {
                node.send({
                    payload: msg.payload.temperature.battery1,
                    topic: ioBrokerPath + 'temperature.battery1',
                    stateName: {
                        "en": "Temperature battery 1",
                        "de": "Temperatur Akku 1"
                    },
                    stateRole: 'state',
                    stateType: 'number',
                    stateUnit: '°C',
                    stateMin: -40,
                    stateMax: 100,
                    stateReadonly: true,
                    ack: true,
                });
            }

            // temperature battery2
            if ('battery2' in msg.payload.temperature) {
                node.send({
                    payload: msg.payload.temperature.battery2,
                    topic: ioBrokerPath + 'temperature.battery2',
                    stateName: {
                        "en": "Temperature battery 2",
                        "de": "Temperatur Akku 2"
                    },
                    stateRole: 'state',
                    stateType: 'number',
                    stateUnit: '°C',
                    stateMin: -40,
                    stateMax: 100,
                    stateReadonly: true,
                    ack: true,
                });
            }
        }



        //////////////////////////////////////////////////
        // status
        //////////////////////////////////////////////////
        if ('status' in msg.payload) {

            // status chargingActive
            if ('chargingActive' in msg.payload.status) {
                node.send({
                    payload: msg.payload.status.chargingActive,
                    topic: ioBrokerPath + 'status.chargingActive',
                    stateName: {
                        "en": "Charging active",
                        "de": "Laden aktiviert"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // status dischargingActive
            if ('dischargingActive' in msg.payload.status) {
                node.send({
                    payload: msg.payload.status.dischargingActive,
                    topic: ioBrokerPath + 'status.dischargingActive',
                    stateName: {
                        "en": "Discharging active",
                        "de": "Entladen aktiviert"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // status balancingActive
            if ('balancingActive' in msg.payload.status) {
                node.send({
                    payload: msg.payload.status.balancingActive,
                    topic: ioBrokerPath + 'status.balancingActive',
                    stateName: {
                        "en": "Balancing active",
                        "de": "Ausgleichen aktiv"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // status batteryDisconnected
            if ('batteryDisconnected' in msg.payload.status) {
                node.send({
                    payload: msg.payload.status.batteryDisconnected,
                    topic: ioBrokerPath + 'status.batteryDisconnected',
                    stateName: {
                        "en": "Battery disconnected",
                        "de": "Akku nicht verbunden"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }
        }
        


        //////////////////////////////////////////////////
        // warning
        //////////////////////////////////////////////////
        if ('warning' in msg.payload) {

            // warning lowCapacity
            if ('lowCapacity' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.lowCapacity,
                    topic: ioBrokerPath + 'warning.lowCapacity',
                    stateName: {
                        "en": "Low capacity",
                        "de": "Niedrige Kapazität"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning mosfetOverTemperature
            if ('mosfetOverTemperature' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.mosfetOverTemperature,
                    topic: ioBrokerPath + 'warning.mosfetOverTemperature',
                    stateName: {
                        "en": "Overtemperature mosfet",
                        "de": "Übertemperatur Mosfet"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning chargingOverVoltage
            if ('chargingOverVoltage' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.chargingOverVoltage,
                    topic: ioBrokerPath + 'warning.chargingOverVoltage',
                    stateName: {
                        "en": "Overvoltage while charging",
                        "de": "Überspannung beim Laden"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning dischargingUnderVoltage
            if ('dischargingUnderVoltage' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.dischargingUnderVoltage,
                    topic: ioBrokerPath + 'warning.dischargingUnderVoltage',
                    stateName: {
                        "en": "Undervoltage while discharging",
                        "de": "Unterspannung beim Entladen"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning batteryOverTemperature1
            if ('batteryOverTemperature1' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.batteryOverTemperature1,
                    topic: ioBrokerPath + 'warning.batteryOverTemperature1',
                    stateName: {
                        "en": "Übertemperatur battery 1",
                        "de": "Übertemperatur Akku 1"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning chargingOverCurrent
            if ('chargingOverCurrent' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.chargingOverCurrent,
                    topic: ioBrokerPath + 'warning.chargingOverCurrent',
                    stateName: {
                        "en": "Charging overcurrent",
                        "de": "Ladestrom überschritten"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning dischargingOverCurrent
            if ('dischargingOverCurrent' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.dischargingOverCurrent,
                    topic: ioBrokerPath + 'warning.dischargingOverCurrent',
                    stateName: {
                        "en": "Discharging overcurrent",
                        "de": "Entladestrom überschritten"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning cellVoltageDifference
            if ('cellVoltageDifference' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.cellVoltageDifference,
                    topic: ioBrokerPath + 'warning.cellVoltageDifference',
                    stateName: {
                        "en": "Cellvoltage difference",
                        "de": "Zellspannungsdifferenz"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning batteryOverTemperature2
            if ('batteryOverTemperature2' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.batteryOverTemperature2,
                    topic: ioBrokerPath + 'warning.batteryOverTemperature2',
                    stateName: {
                        "en": "Übertemperatur battery 2",
                        "de": "Übertemperatur Akku 2"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning batteryUnderTemperature
            if ('batteryUnderTemperature' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.batteryUnderTemperature,
                    topic: ioBrokerPath + 'warning.batteryUnderTemperature',
                    stateName: {
                        "en": "Undertemperatur battery",
                        "de": "Untertemperatur Akku"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning cellOverVoltage
            if ('cellOverVoltage' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.cellOverVoltage,
                    topic: ioBrokerPath + 'warning.cellOverVoltage',
                    stateName: {
                        "en": "Overvoltage batterycell",
                        "de": "Überspannung Akkuzelle"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning cellUnderVoltage
            if ('cellUnderVoltage' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.cellUnderVoltage,
                    topic: ioBrokerPath + 'warning.cellUnderVoltage',
                    stateName: {
                        "en": "Undervoltage batterycell",
                        "de": "Unterspannung Akkuzelle"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning alarm309_AProtection
            if ('alarm309_AProtection' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.alarm309_AProtection,
                    topic: ioBrokerPath + 'warning.alarm309_AProtection',
                    stateName: {
                        "en": "A Protection"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }

            // warning alarm309_BProtection
            if ('alarm309_BProtection' in msg.payload.warning) {
                node.send({
                    payload: msg.payload.warning.alarm309_BProtection,
                    topic: ioBrokerPath + 'warning.alarm309_BProtection',
                    stateName: {
                        "en": "B Protection"
                    },
                    stateRole: 'state',
                    stateType: 'boolean',
                    stateReadonly: true,
                    ack: true,
                });
            }
        }



        //////////////////////////////////////////////////
        // cells
        //////////////////////////////////////////////////
        if (('cell_voltage' in msg.payload) && ('cells' in msg.payload)) {

            // cells
            node.send({
                payload: msg.payload.cells,
                topic: ioBrokerPath + 'cells',
                stateName: {
                    "en": "Battery cells",
                    "de": "Akkuzellen"
                },
                stateRole: 'state',
                stateType: 'number',
                stateReadonly: true,
                ack: true,
            });

            // cells voltage
            for (let cell = 0; cell < msg.payload.cells; cell++) {
                if (cell in msg.payload.cell_voltage) {
                    node.send({
                        payload: msg.payload.cell_voltage[cell],
                        topic: ioBrokerPath + 'cells.' + (cell + 1) + '.voltage',
                        stateName: {
                            "en": "Voltage",
                            "de": "Spannung"
                        },
                        stateRole: 'state',
                        stateType: 'number',
                        stateUnit: 'V',
                        stateReadonly: true,
                        ack: true,
                    });
                }
            }
        }
    }
}
return;
