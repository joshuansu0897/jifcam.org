import React, { Component } from "react";
import connect from "../../assets/redux/connect";

class VideosPage extends Component {
    constructor(props) {
        super(props);
        this.videos = [];
        this.ID = props.match.params.id;
    }

    componentDidMount() {
        console.log(this.props, this.ID);
        if (typeof window !== "undefined") {
            let { token } = this.props;
            console.log(this.ID, token);
            this.props.getOneUserData(this.ID, token);
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
        let { current } = this.props;
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
                                    {current.videos.map(video => {
                                        return (
                                            <div
                                                key={video._id}
                                                className="video-view"
                                            >
                                                {video.path ? (
                                                    <div className="video-holder">
                                                        <video
                                                            src={video.path}
                                                            playsInline={true}
                                                        />
                                                        <div
                                                            className="overlay-video"
                                                            onClick={
                                                                this
                                                                    .clickOnOverlay
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
                                                        Video is not Downloaded
                                                        yet{" "}
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
