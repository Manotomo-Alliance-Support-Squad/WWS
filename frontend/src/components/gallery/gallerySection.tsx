import React from 'react';
import {Artwork} from '../../models/artwork';
import ArtworkCard from './artworkCard/artworkCard';
import DisplayedLanguage from "../../models/language";
import BaseSection, {BaseSectionProps, BaseSectionState} from "../../shared/components/baseSection/baseSection";
import {CardStyleLength} from "../../shared/components/baseCard/baseCard";
import './gallerySection.css';

interface GallerySectionProps extends BaseSectionProps<Artwork> {
}

interface GallerySectionState extends BaseSectionState {

}

// export default class GallerySection extends React.Component<GallerySectionProps, GallerySectionState> {
export default class GallerySection extends BaseSection<Artwork> {
    renderCard(object: Artwork, cardStyleNum: number, language: DisplayedLanguage, id: number): JSX.Element {
        return (
            // TODO: edit gallery-section to display at a specific scale
            <div className="gallery-section">
                <ArtworkCard key={object.artworkID} object={object} cardStyleNum={id % CardStyleLength} language={language}/>
            </div>
        );
    }

    // private data: Artwork[];

    // constructor(props: GallerySectionProps) {
    //     super(props);
    //     this.data = props.data;
    // }

    // render() {
    //     return (
    //         <div className="gallery-section">
    //             {this.data.map((artwork: Artwork) =>
    //                 <ArtworkCard key={artwork.artworkID} artwork={artwork} />
    //             )}
    //         </div>
    //     )
    // }
}
