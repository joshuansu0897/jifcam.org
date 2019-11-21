import React, { Component } from "react";
import connect from "../../../assets/redux/connect";
import { Redirect } from "react-router-dom";
import MasterVideoList from "./MasterVideoListView";
import axios from "../../../utils/axios";

class MasterVideoListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastOffset: 0,
      loadingMore: false
    };
    this.loadMoreData = this.loadMoreData.bind(this);
    this.selectThumbnails = this.selectThumbnails.bind(this);
    this.generateThumbnails = this.generateThumbnails.bind(this);
    this.renderThumbnails = this.renderThumbnails.bind(this);
    this.loadMoreData = this.loadMoreData.bind(this);
    this.deleteVideoById = this.deleteVideoById.bind(this);
    this.deleteUserChannel = this.deleteUserChannel.bind(this);
  }

  selectThumbnails(key, value) {
    let current = this.state[key] || 1;
    if (value === "plus" && current !== 4) {
      current += 1;
    }
    if (value === "minus" && current !== 1) {
      current -= 1;
    }
    this.setDefaultThumbnail(key, current)
    this.setState({
      [key]: current
    });
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      let { token } = this.props.users;
      let offset = this.props.users.videoList.length;
      this.setState({ lastOffset: offset });
      this.props.getUserVideos({ offset, token });
    }
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

  renderThumbnails(index, video) {
    const thumbnails = video.thumbnails;
    const poster = this.generateThumbnails(video.youtubeURL);
    
    if (video.defaultThumbnail){
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${video.defaultThumbnail})` }}
        ></div>
      );
    }

    if (this.state[index] && this.state[index] === 1) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${poster[0]})` }}
        ></div>
      );
    }
    if (this.state[index] && this.state[index] === 2) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[0]})` }}
        ></div>
      );
    }
    if (this.state[index] && this.state[index] === 3) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[1]})` }}
        ></div>
      );
    }
    if (this.state[index] && this.state[index] === 4) {
      return (
        <div
          className="thumbnails"
          style={{ backgroundImage: `url(${thumbnails[2]})` }}
        ></div>
      );
    }
    
    return (
      <div
        className="thumbnails"
        style={{ backgroundImage: `url(${video.thumbnails[1]})` }}
      >
        <video
          playsInline={
              true
          }
        />
      </div>
    );
  }
  async loadMoreData() {
    if (this.props.users.videoList.length > 0) {
      this.setState({ loadingMore: true });
      try {
        await this.props.addUserVideos({
          offset: this.props.users.videoList.length,
          token: this.props.users.token
        });
        this.setState({ loadingMore: false });
      } catch (err) {
        this.setState({ loadingMore: false });
        console.error(err);
      }
    }
  }
  deleteVideoById(id) {
    let token = this.props.users.token;
    alert("Are you sure to delete this video?");
    axios
      .post("/api/videos/remove", {
        id
      })
      .then(done => {
        alert("Video Deleted");
        this.props.getUserVideos({
          offset: 0,
          limit: this.props.users.videoList.length,
          token: this.props.users.token
        });
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  setDefaultThumbnail(videoindex, thumbnailIndex) {
    const video = this.props.users.videoList[videoindex]
    const defaultThumbnail = video.thumbnails[thumbnailIndex-2]
    let token = this.props.users.token;
    axios
      .post("/api/videos/update", {
        id: video._id,
        defaultThumbnail
      })
      .then(done => {
        this.props.getUserVideos({
          offset: 0,
          limit: this.props.users.videoList.length,
          token: this.props.users.token
        });
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  deleteUserChannel(user) {
    let token = this.props.users.token;
    alert("Are you sure to delete this Channel?");
    axios
      .post("/api/users/remove", {
        list: {
          user
        }
      })
      .then(done => {
        alert("Video Channel");
        this.props.getUserVideos({
          offset: 0,
          limit: this.props.users.videoList.length,
          token: this.props.users.token
        });
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  render() {
    return (
      <MasterVideoList
        {...this.state}
        {...this.props}
        generateThumbnails={this.generateThumbnails}
        renderThumbnails={this.renderThumbnails}
        selectThumbnails={this.selectThumbnails}
        deleteVideoById={this.deleteVideoById}
        deleteUserChannel={this.deleteUserChannel}
        loadMoreData={this.loadMoreData}
      />
    );
  }
}

export default connect(MasterVideoListPage);

/*
(
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
)
*/
