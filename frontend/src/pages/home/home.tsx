import React from 'react';
import seedrandom from 'seedrandom';
import ComboSection from '../../components/comboSection/comboSection';
import MessageSection from '../../components/messageSection/messageSection';
import ArchiveSection from '../../components/archiveSection/archiveSection';
import {Message} from "../../models/message";
import {toCountry} from "../../models/country";
import ManoAloeService from "../../controllers/mano-aloe.service";
import SessionService from "../../services/session.service";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import {Announcement} from "../../models/announcement"
import {Artwork, MultiArtwork} from "../../models/artwork"
import {Video} from "../../models/video"
import './home.css';
import '../../shared/globalStyles/global.css'
import AnnouncementSection from "../../components/announcementSection/announcementSection"
import GallerySection from "../../components/gallery/gallerySection"

// Hack for community card before messages
import { LanguageContext, LanguageContextValue } from '../../components/languageSwitch/languageContext';
import MessageCard from '../../components/messageSection/messageCard/messageCard';
import '../../components/headerSection/header.css';

// credits at bottom of the site
import { useLocation } from 'react-router-dom';
import InPageNav from '../../components/inPageNav/inPageNav';
import InfoIcon from '@material-ui/icons/Info';


export interface HomePageProps {

}

export interface HomePageState {
    artloading: boolean;
    messageLoaded: boolean;
    announcementLoaded: boolean;
    messages: Message[];
    announcements: Announcement[];
    artworks: Artwork[];
    multiArtworks: MultiArtwork[];
    videos: Video[];
}

const AltNav = () => {
    const location = useLocation();
    if (location.pathname == "/home") {
        return <InPageNav navButtons={creditsNav}/>;
    }
    return <span />
};

const creditsNav = [
    {
        link: 'https://github.com/Manotomo-Alliance-Support-Squad/WWS',
        buttonContent: "Credits",
        page: "",
        startIcon: <InfoIcon />
    },
]

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
        videos: [],
        multiArtworks: [],
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

        const cachedVideos: Video[] | null = SessionService.getVideo();
        if (cachedVideos && cachedVideos.length) {
            this.setState({videos: cachedVideos});
        } else {
            this.manoAloeService.getVideo()
                .then((videos: Video[]) => {
                    SessionService.saveVideo(videos);
                    this.setState({videos});
                })
                .catch((error: Error) => {
                    console.error(error);
                })
        }

        // Gallery with multiple images
        const cachedMultiGallery: MultiArtwork[] | null = SessionService.getMultiGallery();
        if (cachedMultiGallery && cachedMultiGallery.length) {
            this.setState({multiArtworks: cachedMultiGallery});
        } else {
            this.manoAloeService.getMultiGallery()
                .then((multiArtworks: MultiArtwork[]) => {
                    SessionService.saveMultiGallery(multiArtworks);
                    this.setState({multiArtworks});
                })
                .catch((error: Error) => {
                    console.error(error);
                })
        }
    }

    renderCardSection(data: (Message|Artwork|Video|MultiArtwork)[]) {
        return (
            <div>
                <div className="wrapper-overlay">
                    {this.state.messageLoaded && this.state.announcementLoaded ? <ComboSection data={data}/> : <div/>}
                </div>
            </div>
        )
    }

    randomizeArrayWithSeed(unshuffled_arr: any[], seed: string) {
        let rng = seedrandom(seed);
        // Schwartzian transform
        return unshuffled_arr
            .map((a) => ({sort: rng(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    }

    // We do this because state setting is async and trying to create this in getData yields empty arrays
    compileCardData() {
        let comboCardData: (Message|Artwork|Video|MultiArtwork)[] = [];
        let main_content_array: any[] = [];
        let sub_content_array: any[] = [];
        let multimedia_count: number = this.state.artworks.length + this.state.videos.length + this.state.multiArtworks.length
        let index_increment_spacing: number;
        
        // The higher count of the two types of content gets to determine the sprinkling of the type of content
        if (multimedia_count > this.state.messages.length) {
            main_content_array = this.randomizeArrayWithSeed(
                main_content_array.concat(this.state.multiArtworks, this.state.artworks, this.state.videos),
                "manotomo",
            );
            // TODO: create a randomly seeded version of the main content array
            sub_content_array = this.state.messages;
            
            index_increment_spacing = Math.floor(multimedia_count / this.state.messages.length);
        } else {
            main_content_array = this.state.messages;
            sub_content_array = this.randomizeArrayWithSeed(
                sub_content_array.concat(this.state.multiArtworks, this.state.artworks, this.state.videos),
                "manotomo",
            );

            index_increment_spacing = Math.floor(this.state.messages.length / multimedia_count);
        }

        // Main content is the type of content we have more of
        for (
                let main_content_index = 0, sub_content_index = 0;
                main_content_index < main_content_array.length;
                main_content_index++) {
            comboCardData.push(main_content_array[main_content_index]);
            if (main_content_index % index_increment_spacing === 0 && sub_content_index < sub_content_array.length) {
                comboCardData.push(sub_content_array[sub_content_index]);
                sub_content_index++;
            }
        }

        return comboCardData
    }

    render() {
        const comboCardData = this.compileCardData()
        return (
            <section id='anchor'>
                <div className="home-root">
                    <div className="separator">
                        <AnchorLink offset='120' href='#video-anchor'>
                            <ArrowDropDownCircleOutlinedIcon className="anchor-link" style={{width: 36, height:36}}/>
                        </AnchorLink>
                    </div>
                    <div id="video-anchor" className="main-video-container">
                        <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/i3EBEbdSyTE" title="YouTube video player" frameBorder="0"></iframe>
                    </div>
                    <div id="message-anchor" className="justify-center">
                        <div className="justify-align-center">
                            <AnnouncementSection data={this.state.announcements} customSectionStyle="single-column notice-container"/>
                        </div>
                    </div>
                    <div className="separator">
                        <AnchorLink offset='120' href='#message-anchor'>
                            <ArrowDropDownCircleOutlinedIcon className="anchor-link" style={{width: 36, height:36}}/>
                        </AnchorLink>
                    </div>
                    <div className="justify-center padding-top">
                        <LanguageContext.Consumer>
                            {(value: LanguageContextValue) => {
                                const {language} = value;
                                return (
                                    <div className="justify-align-center notice-container" style={{"whiteSpace": "pre-line"}}>
                                        <MessageCard key={1} object={{ messageID: 0,
                                            tl_msg: "To Haato-sama,\n\n\
                                            I am the initiator of this project, W.Y. Hsieh.\n\n\
                                            Although I have been joining your membership for only a month, every time I see you fully engaged in streams and plans, I couldn???t help but feel encouraged by your strong passion. Without consciousness, I eventually started to cry for your touching moments and feel truly-warmed when you look happy.\n\n\
                                            At the beginning, I was literally the only staff of this project. However, as time goes by, people started to gather in order to cheer you up and finally made this project become large. People from Spain, Germany and countries in east Asia have gave me countless helps so far. Probably people all around the world will gradually become willing to give you a hand once you show your passion and determination.\n\n\
                                            It must be the same being a Vtuber, managing expectations from so many people, and making so many happy.\n\n\
                                            All participants of this project are moved by Haato-sama???s great efforts and came to support you! As we all can tell, your persistence and hard work make you the world-wide strongest idol without doubt!\n\n\
                                            We have the second stage of our project so please look forward to it! We love you, Haato-sama!",
                                            orig_msg: "???????????????\n\n\
                                            ??????????????????????????????????????????????????????????????????????????????\n\n\
                                            ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\n\n\
                                            ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\n\n\
                                            ????????????Vtuber??????????????????????????????????????????\n\n\
                                            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\n\n\
                                            ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                                            country: "(East Asia)", username: "Hsieh", }} cardStyleNum={1} language={language} />
                                    </div>
                                    );
                                }
                            }
                        </LanguageContext.Consumer>
                    </div>
                    {this.renderCardSection(comboCardData)}
                    <div className="justify-center">
                        <div className="notice-container">
                            <div className="notice-content">
                                <p>These are all the messages we managed to collect!</p>
                                <p>Welcome back, Haato. ???????????????????????????</p>
                                <p style={{fontSize: 12}}>If you find any problems with the website, or if you would like to report a message, please contact us at manotomo@googlegroups.com</p>
                            </div>
                        </div>
                    </div>
                    <div style={{height: "25px"}}/>
                    <AltNav />
                </div>
                <div style={{height: "25px"}}/>
            </section>
        )
    }
}
