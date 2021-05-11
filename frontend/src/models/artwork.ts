import { stringToLink, linkToString, ExternalLink } from "./url";

export interface Artwork {
    artworkID: number;
    artworkLink: ExternalLink;
    artistLink: ExternalLink;
    username: string;
    title: string;
}

export interface ArtworkJson {
    artworkID: number;
    artworkLink: string;
    artistLink: string;
    username: string;
    title: string;
}

export interface MultiArtwork {
    setID: string;
    gallery: Artwork[];
}

export interface MultiArtworkJson {
    setID: string;
    gallery: Artwork[];
    // gallery:Array<{
    //     artworkID: number;
    //     artworkLink: string;
    //     artistLink: string;
    //     username: string;
    //     title: string;
    // }>;
}

export function artworkFromJson(json: ArtworkJson): Artwork {
    const { artworkID, artworkLink, artistLink, username, title } = json;
    return {
        artworkID,
        artworkLink: stringToLink(artworkLink),
        artistLink: stringToLink(artistLink),
        username,
        title,
    }
}

export function artworkToJson(artwork: Artwork): ArtworkJson {
    const { artworkID, artworkLink, artistLink, username, title } = artwork;
    return {
        artworkID,
        artworkLink: linkToString(artworkLink),
        artistLink: linkToString(artistLink),
        username,
        title,
    }
}

export function multiArtworkFromJson(json: MultiArtworkJson): MultiArtwork {
    const setID = json["setID"];
    const jsonGallery = json["gallery"];
    let artworkGallery: Artwork[] = [];
    for (var art of jsonGallery) {
        artworkGallery.push(art);
    }
    return {
        setID,
        gallery: artworkGallery,
    }
}

// TODO: Does this need fixing...?
export function multiArtworkToJson(artwork: MultiArtwork): MultiArtworkJson {
    const setID = artwork.setID;
    const gallery = artwork.gallery;
    return {
        setID,
        gallery,
    }
}

