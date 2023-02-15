import { Pool, QueryResult } from "pg";
import { randomUUID } from "crypto";

class User {
    id: string;
    username: string;
    creationDate: Date;

    constructor(id: string, username: string, creationDate: Date) {
        this.id = id;
        this.username = username;
        this.creationDate = creationDate;
    }
}

export function getUsers(pool: Pool) {
    return new Promise((resolve: (value: User[]) => void, reject: (reason?: Error) => void) => {
        pool.query(
            "SELECT * FROM mp3.users",
            (err, res: QueryResult<{ id: string; username: string; creation_date: Date }>) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows.map((row) => new User(row.id, row.username, row.creation_date)));
            }
        );
    });
}

export function getUser(pool: Pool, id: string) {
    return new Promise((resolve: (value: User) => void, reject) => {
        pool.query(
            `SELECT * FROM mp3.users WHERE id = ${id}`,
            (err, res: QueryResult<{ id: string; username: string; creation_date: Date }>) => {
                if (err) {
                    reject(err);
                }
                resolve(new User(res.rows[0].id, res.rows[0].username, res.rows[0].creation_date));
            }
        );
    });
}

export function createUser(pool: Pool, username: string) {
    return new Promise((resolve: (value: User) => void, reject) => {
        const id = randomUUID();
        const creationDate = new Date();
        pool.query(
            "INSERT INTO mp3.users (id, username, creation_date) VALUES ($1, $2, $3)",
            [id, username, creationDate],
            (err, _) => {
                if (err) {
                    reject(err);
                }
                resolve(new User(id, username, creationDate));
            }
        );
    });
}

export function updateUserUsername(pool: Pool, id: string, username: string) {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE mp3.users SET username = $1 WHERE id = $2", [username, id], (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}
