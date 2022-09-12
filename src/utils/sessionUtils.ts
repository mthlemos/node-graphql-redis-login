import { Session } from "express-session"

// Promissifying session methods

export function saveSession(session: Session) {
    return new Promise<Boolean>((resolve, reject) => {
        session.save((err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        })
    })
}

export function destroySession(session: Session) {
    return new Promise<Boolean>((resolve, reject) => {
        session.destroy((err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        })
    })
}