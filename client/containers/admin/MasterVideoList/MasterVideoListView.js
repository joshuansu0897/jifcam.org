import React from "react";
import { Redirect } from "react-router-dom";

const MasterVideoListView = props => {
  const element = React.useRef(null);
  const [show, setShow] = React.useState(false);
  let {
    users: { user, videoList, offset, limit, token },
    generateThumbnails,
    renderThumbnails,
    selectThumbnails,
    deleteVideoById,
    deleteUserChannel
  } = props;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.resolve(
        typeof window.IntersectionObserver !== "undefined"
          ? window.IntersectionObserver
          : import("intersection-observer")
      ).then(() => {
        const observer = new window.IntersectionObserver(entries => {
          const { isIntersecting } = entries[0];
          setShow(false);
          if (isIntersecting && !props.loadingMore) {
            setShow(true);
            props.loadMoreData();
            // observer.disconnect()
          }
        });
        observer.observe(element.current);
      });
    }
  }, [element, typeof window]);

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
              videoList.map((video, index) => {
                return (
                  <div style={{ flexDirection: "column" }} key={index}>
                    <div className="videoCard">
                      {renderThumbnails(index, video)}
                      <span
                        className="leftArrow"
                        onClick={() => selectThumbnails(index, "minus")}
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
                        onClick={() => selectThumbnails(index, "plus")}
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
                        onClick={() => deleteVideoById(video._id)}
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
                        onClick={() => deleteUserChannel(video.user)}
                      >
                        Delete Channel
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <br />
          <br />
          <section ref={element}>
            {!props.users.videoNotLoardMore && (show || props.loadingMore) ? (
              <div>Loadding...</div>
            ) : (
              false
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MasterVideoListView;
