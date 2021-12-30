const DBService = require('../../services/DBService')


async function add(userInput) {
    try {

        const responseStatus = _getResponseStatus(userInput)
        var sqlCmd = `INSERT INTO userinput ( userId, description, serialNum, indicatorStatus1, indicatorStatus2, indicatorStatus3 ) 
        VALUES ("${userInput.userId}",
        "${userInput.description}",
        "${userInput.serialNum}",
        "${userInput.indicatorStatus1}",
                        "${userInput.indicatorStatus2}",
                        "${userInput.indicatorStatus3}" )`
        var userInfo = await DBService.runSQL(sqlCmd)

        sqlCmd = `INSERT INTO tackle (userInfoId, responseStatus) 
                        VALUES ("${userInfo.insertId}",
                        "${responseStatus}" )`

        await DBService.runSQL(sqlCmd)

        return responseStatus
    } catch (err) {
        console.log('cannot add tackle', err);
    }
}

function _getResponseStatus({ serialNum, indicatorStatus1, indicatorStatus2, indicatorStatus3 }) {
    const correctHeads = ['51-B', '36-X', '48-Z']
    const serialNumHead = serialNum.substr(0, 4)
    if (!isNaN(+serialNum)) {
        //TBD...
        console.log('Bad serial number');
        return 'TBD ;)'
    }
    if (serialNumHead === '24-X') return 'please upgrade your device'

    const indicators = [indicatorStatus1, indicatorStatus2, indicatorStatus3]
    const statusCountMap = indicators.reduce((acc, indicator) => {
        if (acc[indicator]) acc[indicator] = acc[indicator] + 1
        else acc[indicator] = 1
        return acc
    }, {})

    if (statusCountMap.off === 3 && correctHeads.includes(serialNumHead)) {
        return 'turn on the device'
    }
    if (statusCountMap.blinking === 1 && (serialNumHead === '48-Z' || serialNumHead === '51-B')) {
        return 'Please wait'
    }
    if (statusCountMap.on > 1 && !statusCountMap.blinking && (serialNumHead === '51-B' || serialNumHead === '48-Z')) {
        return 'ALL is ok'
    }
    return 'Unknown device'
}


module.exports = {
    add
}