import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import axios from "axios";

class VideosPage extends Component {
    constructor(props) {
        super(props);
        this.videos = [];
        this.ID = props.match.params.id;
    }

    componentDidMount() {
        console.log(this.props, this.ID);
        if (typeof window !== "undefined") {
            let { token } = this.props.users;
            console.log(this.ID, token);
            this.props.getOneUserData({ id: this.ID, token });
        }
    }

    clickOnOverlay(event) {
        let overlay = event.currentTarget;
        let video = overlay.parentNode.querySelector("video");
        if (overlay.classList.contains("play")) {
            overlay.classList.remove("play");
            video.pause();
        } else {
            overlay.classList.add("play");
            video.play();
        }
    }

    render() {
        let { current } = this.props.users;
        console.log({ current });
        // return <div />;
        return (
            <div>
                <div className="PageDashboard">
                    <div className="container">
                        <div className="row">
                            {current ? (
                                <div className="col s12">
                                    <h3>
                                        {" "}
                                        Videos of <b>{current.fullname}</b>
                                    </h3>
                                    <hr />
                                    {current.videos &&
                                        current.videos.map(video => {
                                            let thumbnail = ''
                                            if(video.defaultThumbnail){
                                                thumbnail = video.defaultThumbnail
                                            }else{
                                                const videoId = video.youtubeURL.split("=")[1];
                                                thumbnail = axios.get(`/api/videos/${videoId}/default-thumbnail`).then(result => result.defaultThumbnail);
                                               
                                            }
                                            return (
                                                <div
                                                    key={video._id}
                                                    className="video-view"
                                                >
                                                    {video.path ? (
                                                        <div className="video-holder">
                                                            <video
                                                                src={video.path}
                                                                playsInline={
                                                                    true
                                                                }
                                                            />
                                                            <div
                                                                className="overlay-video overlay-video-thumbnail"
                                                                style={ { backgroundImage: `url('${thumbnail}'`} }
                                                                onClick={
                                                                    this.clickOnOverlay
                                                                }
                                                            >
                                                                <i className="large material-icons">
                                                                    play_circle_outline
                                                                </i>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="placeholder-video">
                                                            {" "}
                                                            Video is not
                                                            Downloaded yet{" "}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(VideosPage);
