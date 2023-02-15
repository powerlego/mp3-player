import { Pool } from "pg";
import { randomUUID } from "crypto";

export function getPlaylists(pool: Pool, where?: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM playlists ${where ? `WHERE ${where}` : ""}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows);
        });
    });
}

export function getPlaylist(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function createPlaylist(pool: Pool, name: string, owner: string, tracks?: string[], description?: string) {
    return new Promise((resolve, reject) => {
        const id = randomUUID();
        const creationDate = new Date();
        pool.query(
            "INSERT INTO playlists ("
        + "id, name, tracks, creation_date, description, owner)"
        + "VALUES ($1, $2, $3, $4, $5, $6)",
            [id, name, tracks ?? [], creationDate, description ?? "", owner],
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}
export function deletePlaylist(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM playlists WHERE id = $1", [id], (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

export function addTrackToPlaylist(pool: Pool, playlistId: string, trackId: string) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE playlists SET tracks = array_append(tracks, $1) WHERE id = $2",
            [trackId, playlistId],
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

export function removeTrackFromPlaylist(pool: Pool, playlistId: string, trackId: string) {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE playlists SET tracks = array_remove(tracks, $1) WHERE id = $2",
            [trackId, playlistId],
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

export function getPlaylistName(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT name FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function getPlaylistTracks(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT tracks FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function getPlaylistDescription(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT description FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function getPlaylistOwner(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT owner FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}

export function getPlaylistCreationDate(pool: Pool, id: string) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT creation_date FROM playlists WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    });
}
