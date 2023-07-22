function addCommand(cmd) {
    switch (cmd.command) {
        case 'read':
            // Don't add it if there's already a 'readAll' or 'read' command for the same bmsID and dataIdentifier
            if (!commandQueue.some(command => command.bmsID === cmd.bmsID && (command.command === 'readAll' || (command.command === 'read' && command.dataIdentifier === cmd.dataIdentifier)))) {
                commandQueue.push(Object.assign({}, cmd));
            }
            break;
        
        case 'write':
            // If there's already a 'write' command for the same bmsID and dataIdentifier, update its value. Otherwise, add it
            const existingWriteCommand = commandQueue.find(command => command.bmsID === cmd.bmsID && command.command === 'write' && command.dataIdentifier === cmd.dataIdentifier);
            if (existingWriteCommand) {
                existingWriteCommand.value = cmd.value;
            } else {
                commandQueue.push(Object.assign({}, cmd));
            }
            break;
        
        default:
            // Don't add it if there's already the same command for the same bmsID
            if (!commandQueue.some(command => command.bmsID === cmd.bmsID && command.command === cmd.command)) {
                commandQueue.push(Object.assign({}, cmd));
            }
            break;
    }
}

function getNextCommand() {
    return commandQueue.shift();
}

function saveAllToContext() {
    context.set('commandQueue', commandQueue);
    context.set('currentCommand', currentCommand);
    context.set('lastBmsCommand', lastBmsCommand);
    context.set('activateBms', activateBms);
    context.set('busy', busy);
    measureBusUsage();
}

function measureBusUsage() {
    let totalBusyTime = context.get('totalBusyTime') || 0;
    let busyStartTime = context.get('busyStartTime') || null;
    const programStartTime = context.get('programStartTime') || context.set('programStartTime', Date.now());

    if (busy && busyStartTime === null) {
        busyStartTime = Date.now();
    }

    if (!busy && busyStartTime !== null) {
        totalBusyTime += Date.now() - busyStartTime;
        busyStartTime = null;
    }

    let totalElapsedTime = Date.now() - programStartTime;  // Assuming you record the start time of the program
    debug.payload = Math.floor(totalBusyTime / totalElapsedTime * 100) + '%';
    context.set('totalBusyTime', totalBusyTime);
    context.set('busyStartTime', busyStartTime);
}



const activateBmsTime = 15000;
const retryLater = true;

let commandQueue = context.get('commandQueue') || [];
let currentCommand = context.get('currentCommand') || {};
let lastBmsCommand = context.get('lastBmsCommand') || [];
let activateBms = context.get('activateBms') || false;
let busy = context.get('busy') || false;
let debug = {};



//////////////////////////////////////////////////
// Reset busy or add command to Queue
//////////////////////////////////////////////////
if (msg.payload === 'retry' || msg.payload === 'next' || msg.payload === 'ack'){
    // recieved callback
    busy = false;
    
    // read setting after writing
    if (currentCommand.command === 'write' || msg.payload === 'ack') {
        addCommand({ bmsID: currentCommand.bmsID, command: 'read', dataIdentifier: currentCommand.dataIdentifier});
    }

} else {
    // recieved new command
    addCommand(msg.payload);
}



//////////////////////////////////////////////////
// Send next command if not busy
//////////////////////////////////////////////////
if (busy) {
    saveAllToContext();
    return [null, null];
    
} else {
    if ((!activateBms) || (msg.payload !== 'ack')) {
        // set current command
        if (msg.payload === 'retry') {
            currentCommand.retry = currentCommand.retry + 1 || 1;

            if (retryLater) {
                addCommand(currentCommand);
                currentCommand = getNextCommand();
            }
        } else {
            currentCommand = getNextCommand();
        }
    }

    if (currentCommand != null) {
        // activation necessary?
        if (activateBmsTime != null && currentCommand != null) {
            activateBms = (Date.now() > lastBmsCommand[currentCommand.bmsID] + activateBmsTime);
        } else {
            activateBms = false;
        }

        if (activateBms) {
            // send activation
            lastBmsCommand[currentCommand.bmsID] = Date.now();
            busy = true;
            saveAllToContext();
            return [{ payload: { bmsID: currentCommand.bmsID, command: 'activate' }}, null];

        } else {
            // send command
            lastBmsCommand[currentCommand.bmsID] = Date.now();
            busy = true;
            saveAllToContext();
            return [{ payload: currentCommand }, null];
        }
            
    } else {
        // nothing to send
        saveAllToContext();
        return [null, debug];
    }
}
