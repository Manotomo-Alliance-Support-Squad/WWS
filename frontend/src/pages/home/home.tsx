import React from 'react';
import MessageSection from '../../components/messageSection/messageSection';
import ArchiveSection from '../../components/archiveSection/archiveSection';
import {Message} from "../../models/message";
import {toCountry} from "../../models/country";
import ManoAloeService from "../../controllers/mano-aloe.service";
import SessionService from "../../services/session.service";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import {Announcement} from "../../models/announcement"
import {Artwork} from "../../models/artwork"
import './home.css';
import '../../shared/globalStyles/global.css'
import AnnouncementSection from "../../components/announcementSection/announcementSection"
import GallerySection from "../../components/gallery/gallerySection"

export interface HomePageProps {

}

export interface HomePageState {
    artloading: boolean;
    messageLoaded: boolean;
    announcementLoaded: boolean;
    messages: Message[];
    announcements: Announcement[];
    artworks: Artwork[];
}

export default class HomePage extends React.Component<HomePageProps, HomePageState> {

    constructor(props: HomePageProps,
                private manoAloeService: ManoAloeService) {
        super(props);
        this.manoAloeService = new ManoAloeService();
    }

    state: HomePageState = {
        artloading: true,
        messageLoaded: false,
        announcementLoaded: false,
        messages: [],
        announcements: [],
        artworks: [],
    }

    componentDidMount() {
        this.getData();
    }

    private getData(): void {
        const cachedMessages: Message[] | null = SessionService.getMessages();
        if (cachedMessages && cachedMessages.length) {
            this.setState({messages: cachedMessages, messageLoaded: true});
        } else {
            this.setState({messageLoaded: false});
            this.manoAloeService.getAllMessages()
                .then((messages: Message[]) => {
                    SessionService.saveMessages(messages);
                    this.setState({messages, messageLoaded: true});
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
        this.manoAloeService.getAllAnnouncements()
            .then((announcements: Announcement[]) => {
                this.setState({announcements, announcementLoaded: true});
            })
            .catch((error: Error) => {
                console.error(error);
            });
        const cachedArtworks: Artwork[] | null = SessionService.getGallery();
        if (cachedArtworks && cachedArtworks.length) {
            this.setState({artloading: false, artworks: cachedArtworks});
        } else {
            this.manoAloeService.getGallery()
                .then((artworks: Artwork[]) => {
                    SessionService.saveGallery(artworks);
                    this.setState({artloading: false, artworks});
                })
                .catch((error: Error) => {
                    console.error(error);
                })
        }
    }

    renderMessageCardSection() {
        return (
            <div>
                <div className="wrapper-overlay">
                    {this.state.messageLoaded && this.state.announcementLoaded ? <MessageSection data={this.state.messages}/> : <div/>}
                </div>
            </div>
        )
    }

    renderGallerySection() {
        return (
            <div>
                <div className="wrapper-overlay">
                    <GallerySection data={this.state.artworks}/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <section id='anchor'>
                <div className="home-root">
                    <div className="separator">
                        <AnchorLink offset='120' href='#message-anchor'>
                            <ArrowDropDownCircleOutlinedIcon className="anchor-link" style={{width: 36, height:36}}/>
                        </AnchorLink>
                    </div>
                    <div id="message-anchor" className="justify-center padding-top">
                        <div className="justify-align-center">
                            <AnnouncementSection data={this.state.announcements} customSectionStyle="single-column notice-container"/>
                        </div>
                    </div>
                    {this.renderMessageCardSection()}
                    <div className="justify-center">
                        <div className="notice-container">
                            <div className="notice-content">
                                <p>These are all the messages we managed to collect! Happy Valentine's Day!</p>
                                <p>これがすべての取集したメッセージですが！ハッピーバレンタイン！</p>
                                <p style={{fontSize: 10}}>If you find any problems with the website, or if you would like to report a message, please contact us at manotomo@googlegroups.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{height: "25px"}}/>
            </section>
        )
    }
}
