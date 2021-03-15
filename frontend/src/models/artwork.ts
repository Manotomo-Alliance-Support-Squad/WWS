import { stringToLink, linkToString, ExternalLink } from "./url";

export interface Artwork {
    artworkID: number;
    artworkLink: ExternalLink;
    artistLink: ExternalLink;
    username: string;
    title: string;
    recipient: string;
}

export interface ArtworkJson {
    artworkID: number;
    artworkLink: string;
    artistLink: string;
    username: string;
    title: string;
    recipient: string;
}

export function artworkFromJson(json: ArtworkJson): Artwork {
    const { artworkID, artworkLink, artistLink, username, title, recipient } = json;
    return {
        artworkID,
        artworkLink: stringToLink(artworkLink),
        artistLink: stringToLink(artistLink),
        username,
        title,
        recipient,
    }
}

export function artworkToJson(artwork: Artwork): ArtworkJson {
    const { artworkID, artworkLink, artistLink, username, title, recipient } = artwork;
    return {
        artworkID,
        artworkLink: linkToString(artworkLink),
        artistLink: linkToString(artistLink),
        username,
        title,
        recipient,
    }
}
