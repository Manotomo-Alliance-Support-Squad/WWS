import React from 'react';
import {Artwork} from '../../models/artwork';
import {Message} from "../../models/message";
import DisplayedLanguage from "../../models/language";
import ArtworkCard from '../gallery/artworkCard/artworkCard';
import MessageCard from "../messageSection/messageCard/messageCard";
import BaseSection, {BaseSectionProps, BaseSectionState} from "../../shared/components/baseSection/baseSection";
import {CardStyleLength} from "../../shared/components/baseCard/baseCard";

interface ComboSectionProps extends BaseSectionProps<Message|Artwork> {
}

interface ComboSectionState extends BaseSectionState {

}

function isArtwork(content: Message|Artwork): content is Artwork {
    return true
}

export default class ComboSection extends BaseSection<Message|Artwork> {

    renderCard(object: (Message|Artwork), cardStyleNum: number, language: DisplayedLanguage, id: number): JSX.Element {
            // TODO: messagecard-center might not used or needed
        if (isArtwork(object)) {
            return (
                <div className="gallery-section">
                    <ArtworkCard key={object.artworkID} object={object} cardStyleNum={id % CardStyleLength}/>
                </div>
            );
        } else if (!isArtwork(object)) {
            return (
                <div className="messagecard-center">
                    <MessageCard key={object.messageID} object={object} cardStyleNum={id % CardStyleLength} language={language}/>
                </div>
            );
        }
        return (<div/>);
    }
}
