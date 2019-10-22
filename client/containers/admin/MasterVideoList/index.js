import React, { Component } from "react";
import connect from "../../../assets/redux/connect";
import { Redirect } from "react-router-dom";
import MasterVideoList from "./MasterVideoListView";
import axios from "axios";

class MasterVideoListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastOffset: 0
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

  renderThumbnails(index, video) {
    const thumbnails = video.thumbnails;
    const poster = this.generateThumbnails(video.youtubeURL);

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
  }
  loadMoreData() {
    const wEl = document.querySelector(".container");
    if (window.innerHeight === wEl.getBoundingClientRect().bottom) {
      let offset = this.props.users.videoList.length;
      let token = this.props.users.token;
      if (this.state.lastOffset !== offset) {
        this.setState({ lastOffset: offset });
        this.props.getUserVideos(offset, token);
      }
    }
  }
  deleteVideoById(id) {
    console.log("click ---", id);
    let token = this.props.users.token;
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
        console.log(this.state.lastOffset);
        this.props.getUserVideos(this.state.lastOffset, token, true);
      })
      .catch(error => {
        alert("an error occurred:" + JSON.stringify(error));
      });
  }
  deleteUserChannel(user) {
    let token = this.props.users.token;
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
    return (
      <MasterVideoList
        {...this.state}
        {...this.props}
        generateThumbnails={this.generateThumbnails}
        renderThumbnails={this.renderThumbnails}
        selectThumbnails={this.selectThumbnails}
        deleteVideoById={this.deleteVideoById}
        deleteUserChannel={this.deleteUserChannel}
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
