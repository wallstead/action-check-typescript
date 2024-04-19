import { ErrorTs } from "./main"
import { info } from '@actions/core'

const BLANK_LINE = '  \n'
export const COMMENT_TITLE = '## Typescript errors check'

type Input = {
    errorsInProjectBefore: ErrorTs[]
    errorsInProjectAfter: ErrorTs[]
    newErrorsInProject: ErrorTs[]
    errorsInModifiedFiles: ErrorTs[]
    newErrorsInModifiedFiles: ErrorTs[]
}

export function getBodyComment({ errorsInProjectBefore, errorsInProjectAfter, errorsInModifiedFiles, newErrorsInProject }: Input): string {

    info(`errorsInProjectBefore: ${errorsInProjectBefore}, errorsInProjectAfter: ${errorsInProjectAfter}, errorsInModifiedFiles: ${errorsInModifiedFiles}, newErrorsInProject: ${newErrorsInProject}`);
    const delta = errorsInProjectAfter.length - errorsInProjectBefore.length
    let s = `${COMMENT_TITLE}  \n`

    const areStillErrors = !!errorsInProjectAfter.length

    if (areStillErrors) {
        if (delta < 0) {
            s += BLANK_LINE
            s += `You have removed ${-delta} errors with this PR 👏  \n`
            s += BLANK_LINE
        } else if (delta > 0) {
            s += BLANK_LINE
            s += `You have added ${delta} errors with this PR 😥  \n`
            s += BLANK_LINE
        }
        s += `**${errorsInProjectAfter.length} TS error${errorsInProjectAfter.length === 1 ? '' : 's'} detected in the entire codebase 😟.**  \n`
        s += getNbOfErrorsByFile(`Details`, errorsInProjectAfter)
        s += BLANK_LINE
        s += BLANK_LINE

    }

    if (!areStillErrors) {
        s += `No TS errors in the codebase ! 🎉  \n`
        s += BLANK_LINE
        if (delta < 0) {
            s += `Congrats, you have removed ${-delta} TS error${-delta === 1 ? '' : 's'} with this PR 💪  \n`
            s += BLANK_LINE
        }
        return s
    }

    if (!errorsInModifiedFiles.length) {
        s += `Well done! No TS errors in files changed in this PR! 🎉 \n`
        if (delta > 0) {
            s += `This means that your changes have resulted in type error(s) outside of the changed files. \n`
        }
        s += BLANK_LINE
    } else {
        s += `**${errorsInModifiedFiles.length} TS error${errorsInModifiedFiles.length === 1 ? '' : 's'} detected in the modified files.**  \n`
        s += BLANK_LINE
        s += getListOfErrors(`Details`, errorsInModifiedFiles)
        s += BLANK_LINE
    }

    if (newErrorsInProject.length > 0) {
        s += BLANK_LINE
        s += `**${newErrorsInProject.length} new error${newErrorsInProject.length > 1 ? 's' : ''} added** \n`
        s += `*Note: in some rare cases, new errors can be existing errors but with different locations*`
        s += BLANK_LINE
        s += getListOfErrors(`Details`, newErrorsInProject)
        s += BLANK_LINE
    }

    s += BLANK_LINE
    s += BLANK_LINE
    s += '<a href="https://github.com/Arhia/action-check-typescript"><sub>Arhia/action-check-typescript</sub></a>'

    // Github comment body maximum is 65536 characters
    if(s.length > 60000) {
        s = s.substring(0, 59997) + '...';
    }
    return s;
}

function getListOfErrors(title: string, errors: ErrorTs[], thresholdCollapse = 5): string {

    const shouldUseCollapsible = errors.length > thresholdCollapse
    let s = ``

    if (shouldUseCollapsible) {
        s += `<details><summary>${title} </summary>  \n`
        s += BLANK_LINE
        s += BLANK_LINE
    } else {
        s += BLANK_LINE
    }

    s += `\nFilename|Location|Message\n`
    s += `-- | -- | -- \n`
    s += errors.map(err => {
        const message = escapeForMarkdown(shortenMessage(err.message))
        return `${err.fileName}|${err.line}, ${err.column}|${message}`
    }).join('\n')


    if (shouldUseCollapsible) {
        s += BLANK_LINE
        s += `</details>  \n`
    }

    return s

}

export function escapeForMarkdown(s: string): string {
    return s.replace(/\|/g, '\\|')
}

function getNbOfErrorsByFile(title: string, errors: ErrorTs[], thresholdCollapse = 5): string {

    const errorsByFile: {
        fileName: string
        errors: ErrorTs[]
    }[] = []

    errors.forEach(err => {
        const errByFileFound = errorsByFile.find(o => o.fileName === err.fileName)
        if (errByFileFound) {
            errByFileFound.errors.push(err)
        } else {
            errorsByFile.push({
                fileName: err.fileName,
                errors: [err]
            })
        }
    })

    errorsByFile.sort((errA, errB) => {
        return -(errA.errors.length > errB.errors.length)
    })

    const shouldUseCollapsible = errorsByFile.length > thresholdCollapse
    let s = ``

    if (shouldUseCollapsible) {
        s += `<details><summary>${title}</summary>  \n`
        s += BLANK_LINE
        s += BLANK_LINE
    } else {
        s += `${title}  \n`
        s += BLANK_LINE
    }

    s += `\nFilename|Nb of errors\n`
    s += `-- | -- \n`
    s += errorsByFile.map(err => {
        return `${err.fileName}|${err.errors.length}`
    }).join('\n')


    if (shouldUseCollapsible) {
        s += BLANK_LINE
        s += `</details>  \n`
    }

    return s

}


/**
 * Function to intelligently shorten TypeScript error messages.
 * It shortens the quoted types within the messages to a specified length (default 100 characters).
 * 
 * @param {string} s - The TypeScript error message to be shortened.
 * @param {number} [maxLength=100] - The maximum length for the error message.
 * 
 * @returns {string} - The shortened TypeScript error message.
 */
export function shortenMessage(s: string, maxLength: number = 100): string {
    const trimmedStr = s.replace(/'(.*?)'($|[\s.,])/g, (match, p1: string, p2: string) => {
        if(p1.length > 50) {
            return `'${p1.substring(0, 47)}...'${p2}`;
        }
        return `'${p1}'${p2}`;
    });

    if(trimmedStr.length > maxLength) {
        return `${trimmedStr.substring(0, maxLength-3)}...`;
    }
    
    return trimmedStr;
}
