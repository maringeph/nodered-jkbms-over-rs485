if ('payload' in msg) {

    // calculate real_voltage
    if ('voltage' in msg.payload) {
        const voltage_calibrationData = flow.get(msg.payload.bmsID + '_voltage_calibrationData', 'persistent') || null;
        if (voltage_calibrationData != null) {
            msg.payload.device_voltage = msg.payload.voltage;
            const voltage_regression = regression.polynomial(voltage_calibrationData);
            msg.payload.voltage = voltage_regression.predict(msg.payload.current);
        } else {
        }
    }

    // calculate real_current
    if ('current' in msg.payload) {
        const current_calibrationData = flow.get(msg.payload.bmsID + '_current_calibrationData', 'persistent') || null;
        if (current_calibrationData != null) {
            msg.payload.device_current = msg.payload.current;
            const current_regression = regression.polynomial(current_calibrationData);
            msg.payload.current = current_regression.predict(msg.payload.current);
        }
    }

    // calculate real_power
    if (('device_voltage' in msg.payload) && ('device_current' in msg.payload)) {
        msg.payload.power = Math.round(msg.payload.voltage * msg.payload.current * 10) / 10;
    }
}

return msg;
