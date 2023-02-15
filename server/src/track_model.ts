import { Pool } from "pg";
import { randomUUID } from "crypto";

export function getTracks(pool: Pool, where?: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM tracks ${where ? `WHERE ${where}` : ""}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows);
        });
    });
}

export function getTrack(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM tracks WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function createTrack(pool: Pool, name: string, artist: string, album: string, storageLocation: string) {
    return new Promise((resolve, reject) => {
        const id = randomUUID();
        pool.query(
            "INSERT INTO tracks (id, name, artist, album, storage_location) VALUES ($1, $2, $3, $4, $5)",
            [id, name, artist, album, storageLocation],
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

export function updateTrack(
    pool: Pool,
    id: string,
    name?: string,
    artist?: string,
    album?: string,
    storageLocation?: string
) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE tracks SET name = $1, artist = $2, album = $3, storage_location = $4 WHERE id = $5",
            [name, artist, album, storageLocation, id],
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

export function deleteTrack(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM tracks WHERE id = $1", [id], (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}
