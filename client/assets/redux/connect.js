import { connect } from "react-redux";
import * as slices from "./slices";
import { initStore as store } from "./store";

const mapDispatch = {
  ...slices.usersSlice.actions
};
const mapStateToProps = state => state;

export default App => {
  return connect(
    mapStateToProps,
    mapDispatch
  )(App);
};
