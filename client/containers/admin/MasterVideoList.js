import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import TableListComponent from "../../components/user-list";
import { USER_ACTIONS } from "../../constants";
import { removeUsers } from "../../actions/users";
import axios from "axios";

class MasterVideoListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastOffset: 0
    };
    this.loadMoreData = this.loadMoreData.bind(this);
  }

  selectThumbnails(key, value) {
    let current = this.state[key] || 1;
    if (value === "plus" && current !== 3) {
      current += 1;
    }
    if (value === "minus" && current !== 1) {
      current -= 1;
    }
    this.setState({
      [key]: current
    });
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      let { token } = this.props;
      let offset = this.props.videoList.length;
      this.setState({ lastOffset: offset });
      this.props.getUserVideos(offset, token);
    }
    document.addEventListener("scroll", this.loadMoreData);
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", this.loadMoreData);
  }

  generateThumbnails(youtubeUrl) {
    const videoId = youtubeUrl.split("=")[1];
    let thumbnailsUrl = `http://img.youtube.com/vi/${videoId}/`;
    let thumbnails = [];
    thumbnails.push(`${thumbnailsUrl}maxresdefault.jpg`);
    let i = 0;
    while (i < 3) {
      thumbnails.push(`${thumbnailsUrl}${i}.jpg`);
      i++;
    }

    return thumbnails;
  }

  renderThumbnails(index, youtubeUrl) {
    const thumbnails = this.generateThumbnails(youtubeUrl);
    // console.log(thumbnails);
    if (this.state[index] && this.state[index] === 1) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[0]})` }}
        ></div>
      );
    }
    if (this.state[index] && this.state[index] === 2) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[2]})` }}
        ></div>
      );
    }
    if (this.state[index] && this.state[index] === 3) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[3]})` }}
        ></div>
      );
    }
    const videoId = youtubeUrl.split("=")[1];

    return (
      <div
        className="thumbnails"
        style={{
          backgroundImage:
            'url("http://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg")'
        }}
      ></div>
    );
  }
  loadMoreData() {
    const wEl = document.querySelector(".container");
    if (window.innerHeight === wEl.getBoundingClientRect().bottom) {
      let offset = this.props.videoList.length;
      let token = this.props.token;
      if (this.state.lastOffset !== offset) {
        this.setState({ lastOffset: offset });
        this.props.getUserVideos(offset, token);
      }
    }
  }
  deleteVideoById(id) {
    console.log("click ---", id);
    let token = this.props.token;
    alert("Are you sure to delete this video?");
    axios
      .post(
        "/api/videos/remove",
        {
          id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(done => {
        alert("Video Deleted");
        this.props.getUserVideos(this.state.lastOffset, token);
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  deleteUserChannel(user) {
    let token = this.props.token;
    alert("Are you sure to delete this Channel?");
    axios
      .post(
        "/api/remove",
        {
          list: {
            user
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(done => {
        alert("Video Channel");
        this.props.getUserVideos(this.state.lastOffset, token);
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  render() {
    let { user, videoList, offset, limit, token } = this.props;
    if (!user) {
      return <Redirect to="/admin"></Redirect>;
    }
    return (
      <div>
        <div className="PageDashboard">
          <div className="container">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                paddingTop: 20
              }}
            >
              {videoList &&
                videoList
                  .sort((a, b) => {
                    return new Date(b.created) - new Date(a.created);
                  })
                  .map((video, index) => {
                    return (
                      <div style={{ flexDirection: "column" }} key={index}>
                        <div className="videoCard">
                          {this.renderThumbnails(index, video.youtubeURL)}
                          <span
                            className="leftArrow"
                            onClick={() =>
                              this.selectThumbnails(index, "minus")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20.087"
                              height="20.084"
                              viewBox="0 0 20.087 20.084"
                            >
                              <g transform="translate(19.962 0.095) rotate(90)">
                                <g transform="translate(0.03)">
                                  <path
                                    d="M9.948,0a9.918,9.918,0,1,0,9.916,9.919A9.918,9.918,0,0,0,9.948,0Zm0,18.509A8.589,8.589,0,1,1,18.535,9.92,8.6,8.6,0,0,1,9.948,18.509Z"
                                    transform="translate(-0.03)"
                                    fill="#c88d75"
                                    stroke="#c88d75"
                                    strokeWidth="0.25"
                                  />
                                  <path
                                    d="M120.832,172.947l-3.841,3.843-3.841-3.843a.664.664,0,0,0-.939.939l4.309,4.309a.654.654,0,0,0,.472.194.668.668,0,0,0,.472-.194l4.308-4.309a.664.664,0,0,0-.938-.939Z"
                                    transform="translate(-107.121 -165.202)"
                                    fill="#c88d75"
                                    stroke="#c88d75"
                                    strokeWidth="0.25"
                                  />
                                </g>
                              </g>
                            </svg>
                          </span>
                          <span
                            className="rightArrow"
                            onClick={() => this.selectThumbnails(index, "plus")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20.087"
                              height="20.084"
                              viewBox="0 0 20.087 20.084"
                            >
                              <g transform="translate(0.125 19.989) rotate(-90)">
                                <g transform="translate(0.03)">
                                  <path
                                    d="M9.948,0a9.918,9.918,0,1,0,9.916,9.919A9.918,9.918,0,0,0,9.948,0Zm0,18.509A8.589,8.589,0,1,1,18.535,9.92,8.6,8.6,0,0,1,9.948,18.509Z"
                                    transform="translate(-0.03)"
                                    fill="#c88d75"
                                    stroke="#c88d75"
                                    strokeWidth="0.25"
                                  />
                                  <path
                                    d="M120.832,172.947l-3.841,3.843-3.841-3.843a.664.664,0,0,0-.939.939l4.309,4.309a.654.654,0,0,0,.472.194.668.668,0,0,0,.472-.194l4.308-4.309a.664.664,0,0,0-.938-.939Z"
                                    transform="translate(-107.121 -165.202)"
                                    fill="#c88d75"
                                    stroke="#c88d75"
                                    strokeWidth="0.25"
                                  />
                                </g>
                              </g>
                            </svg>
                          </span>

                          <div className="videoCardTitle">{video.title}</div>
                        </div>
                        <div
                          style={{
                            margin: "10px"
                          }}
                        >
                          <button
                            style={{
                              width: "100%",
                              padding: ".5em"
                            }}
                            onClick={() => this.deleteVideoById(video._id)}
                          >
                            Delete Video
                          </button>
                        </div>
                        <div
                          style={{
                            margin: "10px"
                          }}
                        >
                          <button
                            style={{
                              width: "100%",
                              padding: ".5em"
                            }}
                            onClick={() => this.deleteUserChannel(video.user)}
                          >
                            Delete Channel
                          </button>
                        </div>
                      </div>
                    );
                  })}
            </div>
            {/* <button
              onClick={() => {
                // alert('here');
                this.props.getUserVideos(videoList.length, token);
              }}
              >
              Load More
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.users.token,
    videoList: state.videos.list,
    user: state.users.logged
  }),
  dispatch => ({
    getUserVideos: (offset, token) => {
      dispatch({ type: USER_ACTIONS.GET_VIDEO_LIST, data: { offset, token } });
    }
  })
)(MasterVideoListPage);
