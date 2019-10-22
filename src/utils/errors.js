let errors = []

const reportError = payload => {
    errors = [...errors, ...payload]
}

const reportErrors = payload => {
    if (errors.length) {
        console.log('Errors', errors)
        errors = []
    } else {
        console.log("No Errors")
    }
}


export {reportError, reportErrors, errors}